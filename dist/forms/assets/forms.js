(function () {
  const forms = document.querySelectorAll('[data-service-form]');
  const supportEmail = 'info@hexadigitall.com';

  function getFormDataObject(form) {
    const data = {};
    const formData = new FormData(form);

    formData.forEach((value, key) => {
      let normalized = value;
      if (value instanceof File) {
        if (!value.name) {
          return;
        }
        normalized = value.name;
      }

      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(normalized);
        } else {
          data[key] = [data[key], normalized];
        }
      } else {
        data[key] = normalized;
      }
    });

    return data;
  }

  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      campaignName: params.get('utm_campaign') || 'client_intake',
      campaignSource: params.get('utm_source') || 'direct',
      campaignMedium: params.get('utm_medium') || 'form',
      campaignContent: params.get('utm_content') || undefined,
      campaignTerm: params.get('utm_term') || undefined,
    };
  }

  function pickFirst(data, keys) {
    for (const key of keys) {
      if (data[key]) {
        return data[key];
      }
    }
    return '';
  }

  function toMailto(form, data) {
    const subject = form.getAttribute('data-subject') || 'Hexadigitall Service Intake';
    const lines = Object.entries(data).map(([label, value]) => {
      const normalized = Array.isArray(value) ? value.join(', ') : value;
      return `${label}: ${normalized}`;
    });
    const body = lines.join('\n');
    return `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function submitToIntake(endpoint, form) {
    const formData = new FormData(form);
    const subject = form.getAttribute('data-subject') || 'Hexadigitall Service Intake';
    const serviceName = form.getAttribute('data-service') || subject;
    const formspreeEndpoint = form.getAttribute('data-formspree');

    formData.append('subject', subject);
    formData.append('serviceName', serviceName);
    if (formspreeEndpoint) {
      formData.append('formspreeEndpoint', formspreeEndpoint);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const payload = await response.json().catch(() => ({}));
    return { ok: response.ok, payload };
  }

  function buildFormspreeData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
        return;
      }
      formData.append(key, value);
    });
    return formData;
  }

  async function submitToFormspree(url, data) {
    if (!url) return true;
    const formData = buildFormspreeData(data);
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' },
    });
    return response.ok;
  }

  async function submitToAdmin(endpoint, data, form) {
    if (!endpoint) return true;
    const utm = getUtmParams();
    const payload = {
      name: pickFirst(data, ['Full Name', 'full_name', 'name']) || 'Unknown',
      email: pickFirst(data, ['Email', 'email']) || '',
      phone: pickFirst(data, ['Phone', 'phone']) || '',
      service: form.getAttribute('data-service') || form.getAttribute('data-subject') || 'Client Intake',
      city: pickFirst(data, ['Location', 'location', 'City', 'city']) || 'Not provided',
      message: pickFirst(data, ['Career Goals', 'LinkedIn Goals', 'Profile Goals', 'Additional Notes']) || '',
      ...utm,
      formData: data,
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  }

  function printForm() {
    window.print();
  }

  function ensurePrintValueEl(control) {
    let valueEl = control.parentElement?.querySelector('.print-value');
    if (!valueEl) {
      valueEl = document.createElement('div');
      valueEl.className = 'print-value';
      control.insertAdjacentElement('afterend', valueEl);
    }
    return valueEl;
  }

  function getControlPrintValue(control) {
    if (control instanceof HTMLSelectElement) {
      return Array.from(control.selectedOptions)
        .map((option) => option.textContent)
        .join(', ');
    }
    if (control instanceof HTMLTextAreaElement) {
      return control.value || '—';
    }
    if (control instanceof HTMLInputElement) {
      if (control.type === 'file') {
        const files = control.files ? Array.from(control.files) : [];
        return files.length ? files.map((file) => file.name).join(', ') : 'No files selected';
      }
      if (control.type === 'checkbox') {
        return control.checked ? 'Yes' : 'No';
      }
      if (control.type === 'radio') {
        return control.checked ? control.value : '';
      }
      return control.value || '—';
    }
    return '';
  }

  function syncPrintValues(form) {
    const controls = form.querySelectorAll('input, select, textarea');
    controls.forEach((control) => {
      const valueEl = ensurePrintValueEl(control);
      const value = getControlPrintValue(control);
      if (control instanceof HTMLInputElement && control.type === 'radio') {
        if (value) {
          valueEl.textContent = value;
          valueEl.classList.remove('print-hidden');
        } else {
          valueEl.textContent = '';
          valueEl.classList.add('print-hidden');
        }
        return;
      }
      valueEl.textContent = value || '—';
      valueEl.classList.remove('print-hidden');
    });
  }

  function renderAttachmentLinks(form, attachments) {
    if (!attachments || attachments.length === 0) return;
    let container = form.querySelector('[data-attachment-links]');
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('data-attachment-links', 'true');
      container.className = 'attachment-links';
      const statusEl = form.querySelector('[data-status]');
      if (statusEl && statusEl.parentElement) {
        statusEl.parentElement.insertAdjacentElement('afterend', container);
      } else {
        form.appendChild(container);
      }
    }

    const list = attachments
      .map((attachment) => {
        const name = attachment.name || 'Attachment';
        const url = attachment.url || '#';
        return `<li><a href="${url}" target="_blank" rel="noopener">${name}</a></li>`;
      })
      .join('');

    container.innerHTML = `
      <h4>Uploaded files</h4>
      <ul>${list}</ul>
    `;
  }

  forms.forEach((form) => {
    const printButton = form.querySelector('[data-print]');
    const statusEl = form.querySelector('[data-status]');
    if (printButton) {
      printButton.addEventListener('click', (event) => {
        event.preventDefault();
        syncPrintValues(form);
        printForm();
      });
    }

    form.addEventListener('input', () => syncPrintValues(form));
    form.addEventListener('change', () => syncPrintValues(form));
    window.addEventListener('beforeprint', () => syncPrintValues(form));
    syncPrintValues(form);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      if (statusEl) {
        statusEl.textContent = 'Submitting...';
      }

      const intakeEndpoint = form.getAttribute('data-intake-endpoint');
      const mailtoMode = (form.getAttribute('data-mailto') || 'false').toLowerCase() === 'true';

      if (intakeEndpoint) {
        submitToIntake(intakeEndpoint, form)
          .then(({ ok, payload }) => {
            if (statusEl) {
              statusEl.textContent = ok
                ? 'Submitted successfully. We have received your details.'
                : payload.error || 'Submission failed. Please try again.';
            }

            if (ok && mailtoMode) {
              const values = getFormDataObject(form);
              const mailto = toMailto(form, values);
              window.location.href = mailto;
            }

            if (ok && payload && payload.attachments) {
              renderAttachmentLinks(form, payload.attachments);
            }
          })
          .catch(() => {
            if (statusEl) {
              statusEl.textContent = 'Submission failed. Please try again.';
            }
          });
        return;
      }

      const values = getFormDataObject(form);
      const formspreeUrl = form.getAttribute('data-formspree');
      const adminEndpoint = form.getAttribute('data-admin-endpoint');

      Promise.all([
        submitToFormspree(formspreeUrl, values).catch(() => false),
        submitToAdmin(adminEndpoint, values, form).catch(() => false),
      ]).then(([formspreeOk, adminOk]) => {
        if (mailtoMode) {
          const mailto = toMailto(form, values);
          window.location.href = mailto;
        }

        if (!statusEl) return;
        if (formspreeOk && adminOk) {
          statusEl.textContent = 'Submitted successfully.';
        } else if (formspreeOk || adminOk) {
          statusEl.textContent = 'Submitted partially. Please confirm delivery.';
        } else {
          statusEl.textContent = 'Submission failed. Please email info@hexadigitall.com.';
        }
      });
    });
  });
})();
