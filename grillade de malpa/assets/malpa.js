// La Grillade de Malpa : listes de dates, rail de réservation, formulaires, barre mobile.
(function () {
  'use strict';

  // ---- dates : les 30 prochains jours d'ouverture (lundi fermé, comme api/config.php) ----
  var CLOSED = [1];
  var fmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  function fillDates(sel) {
    var d = new Date(); d.setHours(12, 0, 0, 0);
    for (var i = 0, n = 0; n < 30 && i < 45; i++, d.setDate(d.getDate() + 1)) {
      if (CLOSED.indexOf(d.getDay()) !== -1) continue;
      var o = document.createElement('option');
      o.value = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
      var label = fmt.format(d);
      o.textContent = (i === 0 ? "Aujourd'hui, " : i === 1 ? 'Demain, ' : '') + label.charAt(0).toUpperCase() + label.slice(1);
      sel.appendChild(o); n++;
    }
  }
  document.querySelectorAll('select[data-dates]').forEach(fillDates);

  // ---- le rail du tableau d'accueil remplit le formulaire complet ----
  var rail = document.getElementById('rail');
  if (rail) rail.addEventListener('submit', function (e) {
    e.preventDefault();
    ['date', 'time', 'guests'].forEach(function (k) {
      var from = rail.elements[k], to = document.getElementById('r-' + k);
      if (from && to && from.value) to.value = from.value;
    });
    var target = document.getElementById('reserver');
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setTimeout(function () {
      var first = ['r-date', 'r-time', 'r-guests', 'r-name'].map(function (id) { return document.getElementById(id); })
        .filter(function (el) { return el && !el.value; })[0];
      (first || document.getElementById('r-name')).focus({ preventScroll: true });
    }, 450);
  });

  // ---- formulaires : erreurs sous chaque champ, envoi réel, message seulement après réponse ----
  function check(el) {
    var v = (el.value || '').trim();
    if (el.required && !v) return false;
    if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return false;
    if (el.type === 'tel' && v && !/^[+0-9 ().-]{6,30}$/.test(v)) return false;
    return true;
  }
  document.querySelectorAll('form[data-endpoint]').forEach(function (form) {
    var status = form.querySelector('.form__status');
    var button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = [];
      form.querySelectorAll('input, select, textarea').forEach(function (el) {
        if (!el.id || el.closest('.hp')) return;
        var err = document.getElementById(el.id + '-err');
        var ok = check(el);
        el.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (err) err.hidden = ok;
        if (!ok) bad.push(el);
      });
      if (bad.length) {
        status.textContent = bad.length === 1 ? 'Un champ à corriger.' : bad.length + ' champs à corriger.';
        bad[0].focus();
        return;
      }
      button.disabled = true;
      var wait = setTimeout(function () { status.textContent = 'Envoi en cours…'; }, 300);
      fetch(form.dataset.endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            clearTimeout(wait);
            if (res.ok) { form.reset(); status.textContent = form.dataset.sent; return; }
            if (data && data.fields) {
              Object.keys(data.fields).forEach(function (k) {
                var el = form.elements[k]; if (!el) return;
                var err = document.getElementById(el.id + '-err');
                el.setAttribute('aria-invalid', 'true');
                if (err) { err.textContent = data.fields[k]; err.hidden = false; }
              });
            }
            status.textContent = (data && data.error && !data.fields) ? data.error : 'À corriger avant l\'envoi.';
          });
        })
        .catch(function () { clearTimeout(wait); status.textContent = form.dataset.failed; })
        .finally(function () { button.disabled = false; });
    });
  });

  // ---- barre de réservation sur téléphone : visible quand le rail est sorti de l'écran ----
  var bar = document.querySelector('.bar'), hero = document.querySelector('.rail'), book = document.getElementById('reserver');
  if (bar && hero && 'IntersectionObserver' in window) {
    var seen = { hero: true, book: false };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target === hero ? 'hero' : 'book'] = en.isIntersecting; });
      var on = !seen.hero && !seen.book;
      bar.classList.toggle('is-on', on);
      bar.inert = !on;
    });
    io.observe(hero); io.observe(book);
  }
})();
