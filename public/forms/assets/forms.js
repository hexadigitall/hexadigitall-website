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

  forms.forEach((form) => {
    const printButton = form.querySelector('[data-print]');
    const statusEl = form.querySelector('[data-status]');
    if (printButton) {
      printButton.addEventListener('click', (event) => {
        event.preventDefault();
        printForm();
      });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      if (statusEl) {
        statusEl.textContent = 'Submitting...';
      }

      const values = getFormDataObject(form);
      const formspreeUrl = form.getAttribute('data-formspree');
      const adminEndpoint = form.getAttribute('data-admin-endpoint');

      Promise.all([
        submitToFormspree(formspreeUrl, values).catch(() => false),
        submitToAdmin(adminEndpoint, values, form).catch(() => false),
      ]).then(([formspreeOk, adminOk]) => {
        const mailto = toMailto(form, values);
        window.location.href = mailto;

        if (!statusEl) return;
        if (formspreeOk && adminOk) {
          statusEl.textContent = 'Submitted successfully. A pre-filled email has been opened.';
        } else if (formspreeOk || adminOk) {
          statusEl.textContent = 'Submitted partially. A pre-filled email has been opened.';
        } else {
          statusEl.textContent = 'Submission failed. Please email info@hexadigitall.com.';
        }
      });
    });
  });
})();
