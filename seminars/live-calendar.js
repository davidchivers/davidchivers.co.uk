(() => {
  const link = document.getElementById('calendarLink');
  const button = document.getElementById('copyCalendar');
  const status = document.getElementById('copyStatus');
  const labels={external:'External seminars link',coffee:'Seminar coffee link',all:'Seminars and coffee link'};
  document.querySelectorAll('[data-feed]').forEach(choice=>choice.addEventListener('click',()=>{
    link.value='https://economics-seminar-demo.silkyangel64.chatgpt.site/calendar/'+choice.dataset.feed+'.ics';
    document.getElementById('calendarLabel').textContent=labels[choice.dataset.feed];
    document.querySelectorAll('[data-feed]').forEach(b=>b.setAttribute('aria-pressed',String(b===choice)));
    status.textContent='';
  }));
  button.addEventListener('click', async () => {
    link.focus();
    link.select();
    try {
      // The selection-based route also works in embedded browsers whose
      // Clipboard API does not reach the user's normal pasteboard.
      if (!document.execCommand('copy')) {
        await navigator.clipboard.writeText(link.value);
      }
      status.textContent = 'Link ready. If it does not paste, press Ctrl+C (⌘C on Mac) to copy the selected link.';
    } catch {
      link.focus();
      link.select();
      status.textContent = 'Select and copy the highlighted link, then paste it into Outlook.';
    }
  });
})();
