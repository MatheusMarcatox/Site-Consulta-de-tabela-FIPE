const API_BASE = 'https://brasilapi.com.br/api/fipe';

const tipoSelect = document.getElementById('tipo');
const marcaSelect = document.getElementById('marca');
const modeloSelect = document.getElementById('modelo');
const codigoFipeInput = document.getElementById('codigoFipe');
const anoSelect = document.getElementById('ano');
const consultaForm = document.getElementById('consultaForm');
const formResult = document.getElementById('formResult');
const resultValue = document.getElementById('resultValue');
const resultDetails = document.getElementById('resultDetails');
const submitBtn = document.getElementById('submitBtn');
const formError = document.getElementById('formError');

let precosCache = [];

async function fetchApi(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erro na requisição (${response.status})`);
  }

  return response.json();
}

function setLoading(select, loading, placeholder) {
  select.disabled = loading || select.dataset.locked === 'true';
  if (loading) {
    select.innerHTML = `<option value="">Carregando...</option>`;
    return;
  }
  if (placeholder) {
    select.innerHTML = `<option value="">${placeholder}</option>`;
  }
}

function populateSelect(select, items, placeholder, getValue, getLabel) {
  setLoading(select, false);
  select.innerHTML = `<option value="">${placeholder}</option>`;
  items.forEach((item, index) => {
    const option = document.createElement('option');
    option.value = getValue(item, index);
    option.textContent = getLabel(item, index);
    select.appendChild(option);
  });
  select.disabled = false;
  delete select.dataset.locked;
}

function resetSelects(fromSelect) {
  formResult.hidden = true;
  hideError();
  precosCache = [];

  if (fromSelect === 'tipo') {
    setLoading(marcaSelect, false, 'Selecione o tipo primeiro');
    marcaSelect.disabled = true;
    delete marcaSelect.dataset.locked;
  }

  if (fromSelect === 'tipo' || fromSelect === 'marca') {
    setLoading(modeloSelect, false, 'Selecione a marca primeiro');
    modeloSelect.disabled = true;
    delete modeloSelect.dataset.locked;
  }

  if (fromSelect === 'tipo' || fromSelect === 'marca' || fromSelect === 'modelo') {
    codigoFipeInput.value = '';
    codigoFipeInput.disabled = true;
  }

  setLoading(anoSelect, false, 'Informe o código FIPE primeiro');
  anoSelect.disabled = true;
  delete anoSelect.dataset.locked;
}

function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function hideError() {
  formError.hidden = true;
  formError.textContent = '';
}

function setSubmitLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? 'Consultando...' : 'Consultar valor FIPE';
}

function isValidCodigoFipe(codigo) {
  return /^\d{6}-\d$/.test(codigo);
}

async function loadMarcas(tipo) {
  resetSelects('tipo');
  setLoading(marcaSelect, true);

  try {
    const marcas = await fetchApi(`${API_BASE}/marcas/v1/${tipo}`);
    populateSelect(
      marcaSelect,
      marcas,
      'Selecione...',
      (item) => item.valor,
      (item) => item.nome
    );
  } catch (error) {
    setLoading(marcaSelect, false, 'Erro ao carregar marcas');
    marcaSelect.disabled = true;
    showError('Não foi possível carregar as marcas. Tente novamente.');
    console.error(error);
  }
}

async function loadModelos(tipo, marca) {
  resetSelects('marca');
  setLoading(modeloSelect, true);

  try {
    const modelos = await fetchApi(`${API_BASE}/veiculos/v1/${tipo}/${marca}`);
    populateSelect(
      modeloSelect,
      modelos,
      'Selecione...',
      (_item, index) => index,
      (item) => item.modelo
    );
    codigoFipeInput.disabled = false;
  } catch (error) {
    setLoading(modeloSelect, false, 'Erro ao carregar modelos');
    modeloSelect.disabled = true;
    showError('Não foi possível carregar os modelos. Tente novamente.');
    console.error(error);
  }
}

async function loadAnosPorCodigoFipe(codigoFipe) {
  precosCache = [];
  setLoading(anoSelect, true);

  try {
    const precos = await fetchApi(`${API_BASE}/preco/v1/${codigoFipe}`);

    if (!Array.isArray(precos) || precos.length === 0) {
      throw new Error('Nenhum resultado encontrado para este código FIPE.');
    }

    precosCache = precos;
    populateSelect(
      anoSelect,
      precos,
      'Selecione...',
      (_item, index) => index,
      (item) => `${item.anoModelo} — ${item.combustivel}`
    );
  } catch (error) {
    setLoading(anoSelect, false, 'Código FIPE inválido ou indisponível');
    anoSelect.disabled = true;
    showError(error.message || 'Não foi possível buscar os anos deste veículo.');
    console.error(error);
  }
}

tipoSelect.addEventListener('change', () => {
  const tipo = tipoSelect.value;
  if (!tipo) {
    resetSelects('tipo');
    return;
  }
  loadMarcas(tipo);
});

marcaSelect.addEventListener('change', () => {
  const tipo = tipoSelect.value;
  const marca = marcaSelect.value;
  if (!marca) {
    resetSelects('marca');
    return;
  }
  loadModelos(tipo, marca);
});

modeloSelect.addEventListener('change', () => {
  formResult.hidden = true;
  hideError();
  precosCache = [];
  codigoFipeInput.value = '';
  setLoading(anoSelect, false, 'Informe o código FIPE primeiro');
  anoSelect.disabled = true;
});

codigoFipeInput.addEventListener('blur', () => {
  const codigo = codigoFipeInput.value.trim();
  if (!codigo) return;

  if (!isValidCodigoFipe(codigo)) {
    showError('Código FIPE inválido. Use o formato 000000-0 (ex: 001004-9).');
    return;
  }

  hideError();
  loadAnosPorCodigoFipe(codigo);
});

consultaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();
  formResult.hidden = true;

  const codigoFipe = codigoFipeInput.value.trim();
  const anoIndex = anoSelect.value;

  if (!tipoSelect.value || !marcaSelect.value || modeloSelect.value === '') {
    showError('Selecione tipo, marca e modelo.');
    return;
  }

  if (!isValidCodigoFipe(codigoFipe)) {
    showError('Informe um código FIPE válido (ex: 001004-9).');
    return;
  }

  if (anoIndex === '') {
    showError('Selecione o ano/combustível do veículo.');
    return;
  }

  setSubmitLoading(true);

  try {
    if (precosCache.length === 0) {
      precosCache = await fetchApi(`${API_BASE}/preco/v1/${codigoFipe}`);
    }

    const resultado = precosCache[Number(anoIndex)];

    if (!resultado) {
      throw new Error('Resultado não encontrado para o ano selecionado.');
    }

    resultValue.textContent = resultado.valor;
    resultDetails.textContent = `${resultado.marca} ${resultado.modelo} · ${resultado.anoModelo} · ${resultado.combustivel} · Ref: ${resultado.mesReferencia.trim()}`;
    formResult.hidden = false;
    formResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    showError(error.message || 'Erro ao consultar o valor FIPE.');
    console.error(error);
  } finally {
    setSubmitLoading(false);
  }
});

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('[data-scroll]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const statsSection = document.querySelector('.hero__stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('[data-count]').forEach((el) => {
          const target = parseInt(el.dataset.count, 10);
          const duration = 1500;
          const start = performance.now();
          const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
        });
        statsObserver.disconnect();
      });
    },
    { threshold: 0.5 }
  );
  statsObserver.observe(statsSection);
}
