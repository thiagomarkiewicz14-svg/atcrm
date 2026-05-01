export function generateReportLink(visitId: string) {
  return `${window.location.origin}/visits/${visitId}/report`;
}

export async function generateVisitPdf(visitId: string): Promise<Blob> {
  const iframe = document.createElement('iframe');
  iframe.src = `${generateReportLink(visitId)}?print=1`;
  iframe.style.position = 'fixed';
  iframe.style.left = '-10000px';
  iframe.style.top = '0';
  iframe.style.width = '820px';
  iframe.style.height = '1200px';
  iframe.style.opacity = '0';
  iframe.setAttribute('aria-hidden', 'true');

  document.body.appendChild(iframe);

  try {
    const { element, fileName } = await waitForReportContent(iframe);
    const { default: html2pdf } = await import('html2pdf.js');

    const blob = await html2pdf()
      .set({
        margin: [8, 8, 8, 8],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.96 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .outputPdf('blob');

    downloadBlob(blob, fileName);
    return blob;
  } finally {
    iframe.remove();
  }
}

function waitForReportContent(iframe: HTMLIFrameElement) {
  return new Promise<{ element: HTMLElement; fileName: string }>((resolve, reject) => {
    const startedAt = Date.now();
    const timeoutMs = 20_000;

    const check = () => {
      const doc = iframe.contentDocument;
      const element = doc?.getElementById('visit-report-content');

      if (element instanceof HTMLElement && element.dataset.ready === 'true') {
        window.setTimeout(() => {
          resolve({
            element,
            fileName: element.dataset.fileName || 'relatorio-visita.pdf',
          });
        }, 500);
        return;
      }

      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error('Não foi possível preparar o relatório para PDF.'));
        return;
      }

      window.setTimeout(check, 200);
    };

    iframe.addEventListener('load', check, { once: true });
    check();
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
