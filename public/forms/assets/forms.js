(function () {
  const forms = document.querySelectorAll('[data-service-form]');
  const supportEmail = 'info@hexadigitall.com';

  function serializeForm(form) {
    const entries = [];
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach((field) => {
      const type = field.type;
      const name = field.getAttribute('data-label') || field.name || field.id;
      if (!name) return;

      if (type === 'checkbox') {
        if (!field.checked) return;
        entries.push([name, field.value || 'Yes']);
        return;
      }

      if (type === 'radio') {
        if (!field.checked) return;
        entries.push([name, field.value]);
        return;
      }

      const value = field.value.trim();
      if (!value) return;
      entries.push([name, value]);
    });

    return entries;
  }

  function toMailto(form, entries) {
    const subject = form.getAttribute('data-subject') || 'Hexadigitall Service Intake';
    const lines = entries.map(([label, value]) => `${label}: ${value}`);
    const body = lines.join('\n');
    return `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function printForm() {
    window.print();
  }

  forms.forEach((form) => {
    const printButton = form.querySelector('[data-print]');
    if (printButton) {
      printButton.addEventListener('click', (event) => {
        event.preventDefault();
        printForm();
      });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const entries = serializeForm(form);
      const mailto = toMailto(form, entries);
      window.location.href = mailto;
    });
  });
})();
