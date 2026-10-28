// Menu Inu · interactividad básica
document.addEventListener('DOMContentLoaded', () => {

  // --- Modo oscuro / claro ---
  const root = document.documentElement;
  const btnTema = document.getElementById('theme-toggle');

  const aplicarTema = (tema) => {
    root.setAttribute('data-theme', tema);
    btnTema.textContent = tema === 'dark' ? 'Modo Claro' : 'Modo Oscuro';
  };

  let guardado = null;
  try { guardado = localStorage.getItem('menu-inu-tema'); } catch (e) {}
  aplicarTema(guardado === 'light' ? 'light' : 'dark');

  btnTema.addEventListener('click', () => {
    const nuevo = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    aplicarTema(nuevo);
    try { localStorage.setItem('menu-inu-tema', nuevo); } catch (e) {}
  });

  // --- Saludo según la hora ---
  const hora = new Date().getHours();
  const saludo = hora < 12 ? '¡Buenos días!' : hora < 19 ? '¡Buenas tardes!' : '¡Buenas noches!';
  document.getElementById('saludo').textContent = saludo + ' Bienvenido a Menu Inu, la cafetería saludable';

  // --- Filtro del menú ---
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.card');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    cards.forEach(card => {
      card.classList.toggle('hide', !(f === 'todos' || card.dataset.cat === f));
    });
  }));

  // --- Calculadora de IMC ---
  const form = document.getElementById('imc-form');
  const out = document.getElementById('resultado');
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const peso = parseFloat(document.getElementById('peso').value);
    const alturaCm = parseFloat(document.getElementById('altura').value);

    out.className = 'resultado';
    if (!peso || !alturaCm || peso <= 0 || alturaCm <= 0) {
      out.classList.add('err', 'show');
      out.innerHTML = '<span class="cat">⚠️ Ingresa un peso y una estatura válidos.</span>';
      return;
    }
    const m = alturaCm / 100;
    const imc = peso / (m * m);

    let cat, clase, consejo;
    if (imc < 18.5)    { cat = 'Bajo peso';   clase = 'c1'; consejo = 'Incluye más alimentos nutritivos como avena, frutos secos y proteínas.'; }
    else if (imc < 25) { cat = 'Peso normal'; clase = 'c2'; consejo = '¡Excelente! Mantén tus hábitos y sigue eligiendo el menú saludable.'; }
    else if (imc < 30) { cat = 'Sobrepeso';   clase = 'c3'; consejo = 'Prefiere agua, más verduras y porciones moderadas. ¡Muévete más!'; }
    else               { cat = 'Obesidad';    clase = 'c4'; consejo = 'Consulta a un profesional de la salud y elige platillos ligeros del menú.'; }

    out.classList.add(clase, 'show');
    out.innerHTML = `
      <div class="valor">${imc.toFixed(1)}</div>
      <div class="cat">${cat}</div>
      <p>${consejo}</p>
      <small>Para menores de 18 años, el IMC se interpreta por percentiles de edad y sexo. Es solo una referencia educativa.</small>`;
  });

  // --- Carrusel (sin autoplay) ---
  const slides = document.querySelectorAll('.slide');
  const dotsBox = document.querySelector('.dots');
  let actual = 0;

  const dots = Array.from(slides).map((_, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('aria-label', 'Ir a la imagen ' + (i + 1));
    d.addEventListener('click', () => mostrar(i));
    dotsBox.appendChild(d);
    return d;
  });

  function mostrar(n) {
    actual = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === actual));
    dots.forEach((d, i) => d.classList.toggle('active', i === actual));
  }
  document.querySelector('.car-btn.prev').addEventListener('click', () => mostrar(actual - 1));
  document.querySelector('.car-btn.next').addEventListener('click', () => mostrar(actual + 1));
  mostrar(0);
});