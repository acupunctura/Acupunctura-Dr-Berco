// script.js - ULTRA interactions (nav, animations, lightbox, testimonials, form)
document.addEventListener('DOMContentLoaded', function () {
  // AOS init (if available)
  if(window.AOS) AOS.init({once:true, duration:700, easing:'ease-out-cubic'});

  // Sticky header on scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if(window.scrollY > 40) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  });

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  // Close nav on link click (mobile)
  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', ()=>{ mainNav.classList.remove('open'); hamburger.classList.remove('open'); });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  document.querySelectorAll('.gallery a.lightbox').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      lbImg.src = a.href;
      lightbox.setAttribute('aria-hidden','false');
    });
  });
  lbClose.addEventListener('click', ()=> lightbox.setAttribute('aria-hidden','true'));
  lightbox.addEventListener('click', (e)=> { if(e.target===lightbox) lightbox.setAttribute('aria-hidden','true'); });

  // Testimonials simple slider
  const tSlider = document.getElementById('tSlider');
  const tItems = tSlider.querySelectorAll('.t-item');
  let tIndex = 0;
  const showTestimonial = (i) => {
    tItems.forEach((it, idx)=> it.style.display = (idx===i ? 'block' : 'none'));
  };
  showTestimonial(0);
  document.getElementById('tPrev').addEventListener('click', ()=> { tIndex = (tIndex-1 + tItems.length) % tItems.length; showTestimonial(tIndex); });
  document.getElementById('tNext').addEventListener('click', ()=> { tIndex = (tIndex+1) % tItems.length; showTestimonial(tIndex); });
  // auto rotate
  setInterval(()=> { tIndex = (tIndex+1) % tItems.length; showTestimonial(tIndex); }, 6000);

  // Simple form handling (works with sendmail.php or Formspree endpoint)
  const form = document.getElementById('bookingForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    status.textContent = '';
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Se trimite...';

    // create formdata
    const fd = new FormData(form);
    const action = form.getAttribute('action') || ''; // sendmail.php or Formspree endpoint

    // if action looks like sendmail.php (relative), do a normal POST (works on PHP hosting)
    if(!action.match(/^https?:\/\//i)){
      // submit via fetch relative (may require hosting with PHP)
      fetch(action, {method:'POST', body: fd})
        .then(r => {
          if(r.redirected){
            window.location = r.url;
            return;
          }
          return r.text();
        })
        .then(txt=>{
          btn.disabled = false;
          btn.textContent = 'Trimite programarea';
          status.textContent = 'Mesaj trimis! Vei fi contactat curând.';
          form.reset();
        }).catch(err=>{
          btn.disabled = false;
          btn.textContent = 'Trimite programarea';
          status.textContent = 'Eroare la trimitere. Încearcă din nou sau folosește telefonul.';
          console.error(err);
        });
      return;
    }

    // if action is absolute (Formspree endpoint), POST JSON or formdata
    fetch(action, {method:'POST', body: fd, headers: { 'Accept': 'application/json' }})
      .then(r => r.json ? r.json() : r.text())
      .then(data => {
        btn.disabled = false;
        btn.textContent = 'Trimite programarea';
        status.textContent = 'Mesaj trimis! Verifică emailul pentru confirmare.';
        form.reset();
      })
      .catch(err => {
        btn.disabled = false;
        btn.textContent = 'Trimite programarea';
        status.textContent = 'Eroare la trimitere. Încearcă din nou.';
        console.error(err);
      });
  });
});
