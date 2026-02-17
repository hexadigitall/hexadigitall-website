import { NextRequest, NextResponse } from 'next/server'
import { Buffer } from 'node:buffer'
import crypto from 'node:crypto'
import { writeClient } from '@/sanity/client'
import { emailService } from '@/lib/email'

export const runtime = 'nodejs'

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024
const MAX_EMAIL_ATTACHMENT_BYTES = 10 * 1024 * 1024

type Attachment = {
	name: string
	url: string
	type: string
	size: number
	assetId?: string
	_key?: string
}

type FormField = {
	key: string
	value: string
	_key?: string
}

function makeKey() {
	return crypto.randomBytes(8).toString('hex')
}

function isFile(value: FormDataEntryValue): value is File {
	return typeof File !== 'undefined' && value instanceof File
}

function appendField(acc: Record<string, string | string[]>, key: string, value: string) {
	if (acc[key]) {
		if (Array.isArray(acc[key])) {
			acc[key].push(value)
		} else {
			acc[key] = [acc[key] as string, value]
		}
	} else {
		acc[key] = value
	}
}

function pickFirst(fields: Record<string, string | string[]>, keys: string[]) {
	for (const key of keys) {
		const value = fields[key]
		if (!value) continue
		if (Array.isArray(value)) return value[0]
		return value
	}
	return ''
}

function toStringValue(value: string | string[]) {
	if (Array.isArray(value)) return value.join(', ')
	return value
}

async function uploadAttachment(file: File): Promise<Attachment> {
	if (file.size > MAX_FILE_SIZE_BYTES) {
		throw new Error(`${file.name} exceeds ${Math.round(MAX_FILE_SIZE_BYTES / 1024 / 1024)}MB limit`)
	}

	const buffer = Buffer.from(await file.arrayBuffer())
	const assetType = file.type.startsWith('image/') ? 'image' : 'file'
	const asset = await writeClient.assets.upload(assetType, buffer, {
		filename: file.name,
		contentType: file.type || undefined,
	})

	return {
		name: file.name,
		url: asset.url,
		assetId: asset._id,
		type: file.type || assetType,
		size: file.size,
	}
}

function getMaskedAttachmentUrl(origin: string, attachment: Attachment) {
	if (!attachment.assetId) return attachment.url
	return `${origin}/api/files/${encodeURIComponent(attachment.assetId)}`
}

function buildEmailHtml(subject: string, fields: FormField[], attachments: Attachment[]) {
	const rows = fields
		.map(
			(field) => `
				<tr>
					<td style="padding:8px 12px;border:1px solid #e2e8f0;"><strong>${field.key}</strong></td>
					<td style="padding:8px 12px;border:1px solid #e2e8f0;white-space:pre-wrap;">${field.value}</td>
				</tr>
			`
		)
		.join('')

	const attachmentList = attachments.length
		? `<ul>${attachments
				.map(
					(att) =>
						`<li><a href="${att.url}" target="_blank" rel="noopener">${att.name}</a> (${Math.round(
							att.size / 1024
						)} KB)</li>`
				)
				.join('')}</ul>`
		: '<p>No attachments uploaded.</p>'

	return `
		<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;">
			<h2 style="margin-bottom:8px;">${subject}</h2>
			<p style="margin-top:0;color:#475569;">New client intake submission.</p>
			<table style="width:100%;border-collapse:collapse;">${rows}</table>
			<h3 style="margin-top:24px;">Attachments</h3>
			${attachmentList}
		</div>
	`
}

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const fields: Record<string, string | string[]> = {}
		const files: File[] = []
		const emailAttachments: Array<{ filename: string; content: string; contentType?: string }> = []
		let totalEmailBytes = 0

		for (const [key, value] of formData.entries()) {
			if (key === 'formspreeEndpoint') continue
			if (isFile(value)) {
				if (value.size > 0) {
					files.push(value)

					if (totalEmailBytes + value.size <= MAX_EMAIL_ATTACHMENT_BYTES) {
						const buffer = Buffer.from(await value.arrayBuffer())
						emailAttachments.push({
							filename: value.name,
							content: buffer.toString('base64'),
							contentType: value.type || undefined,
						})
						totalEmailBytes += value.size
					}
				}
				continue
			}
			appendField(fields, key, value.toString())
		}

		const attachments: Attachment[] = []
		for (const file of files) {
			const uploaded = await uploadAttachment(file)
			attachments.push({ ...uploaded, _key: makeKey() })
		}

		const serviceName = pickFirst(fields, ['serviceName', 'Service', 'service']) || 'Client Intake'
		const subject = pickFirst(fields, ['subject', 'Subject']) || `${serviceName} Intake`
		const name = pickFirst(fields, ['Full Name', 'full_name', 'name']) || 'Unknown'
		const email = pickFirst(fields, ['Email', 'email']) || ''
		const phone = pickFirst(fields, ['Phone', 'phone']) || ''
		const company = pickFirst(fields, ['Company', 'company']) || ''
		const city = pickFirst(fields, ['Location', 'location', 'City', 'city']) || 'Not provided'
		const message =
			pickFirst(fields, [
				'Additional Notes',
				'Primary Goal',
				'Website Goals',
				'Offer and CTA',
				'Profile Goals',
				'Career Goals',
				'LinkedIn Goals',
			]) || ''

		const fieldEntries: FormField[] = Object.entries(fields).map(([key, value]) => ({
			_key: makeKey(),
			key,
			value: toStringValue(value),
		}))

		const submission = {
			_type: 'formSubmission',
			type: 'service',
			status: 'new',
			name,
			email,
			phone,
			company,
			subject,
			message,
			service: serviceName,
			city,
			formData: {
				raw: JSON.stringify({ fields, attachments }, null, 2),
				fields: fieldEntries,
			},
			attachments,
			submittedAt: new Date().toISOString(),
			ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
			userAgent: request.headers.get('user-agent'),
			referrer: request.headers.get('referer'),
		}

		await writeClient.create(submission)

		const recipientRaw = process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'info@hexadigitall.com'
		const recipients = recipientRaw
			.split(',')
			.map((value) => value.trim())
			.filter(Boolean)
		const html = buildEmailHtml(subject, fieldEntries, attachments)

		const emailResult = await emailService.sendEmail({
			to: recipients.length > 0 ? recipients : 'info@hexadigitall.com',
			subject: `${subject} - ${name}`,
			html,
			replyTo: email || undefined,
			attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
		})

		if (!emailResult.success) {
			console.error('Intake email failed', {
				error: emailResult.error,
				recipients,
			})
		}

		const formspreeEndpoint = formData.get('formspreeEndpoint')?.toString()
		if (formspreeEndpoint) {
			const forwardData = new FormData()
			fieldEntries.forEach((entry) => forwardData.append(entry.key, entry.value))
			if (attachments.length > 0) {
				forwardData.append(
					'attachments',
					attachments.map((att) => `${att.name}: ${att.url}`).join('\n')
				)
			}
			await fetch(formspreeEndpoint, {
				method: 'POST',
				body: forwardData,
				headers: { Accept: 'application/json' },
			}).catch(() => null)
		}

		const debug = request.nextUrl.searchParams.get('debug') === '1'
		const origin = request.nextUrl.origin
		const maskedAttachments = attachments.map((attachment) => ({
			...attachment,
			url: getMaskedAttachmentUrl(origin, attachment),
		}))

		return NextResponse.json({
			success: true,
			attachments: maskedAttachments,
			...(debug ? { emailResult, recipients } : {}),
		})
	} catch (error) {
		console.error('Form intake error:', error)
		return NextResponse.json(
			{ success: false, error: error instanceof Error ? error.message : 'Failed to submit form' },
			{ status: 500 }
		)
	}
}

export {}
