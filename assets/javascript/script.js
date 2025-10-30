document.addEventListener('DOMContentLoaded', () => {
    const pesoInput = document.getElementById('peso');
    const alturaInput = document.getElementById('altura');
    const calcularBtn = document.getElementById('calcular-btn');
    const resultadoContainer = document.getElementById('resultado-container');
    const imcResultado = document.getElementById('imc-resultado');
    const classificacaoOutput = document.getElementById('classificacao');
    const erroMensagem = document.getElementById('erro-mensagem');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const tabelaBody = document.querySelector('.table-container tbody');

    
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    body.className = savedTheme;
    updateThemeIcon(savedTheme);

    function updateThemeIcon(theme) {
        if (theme === 'dark-mode') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.className;
        const newTheme = currentTheme === 'light-mode' ? 'dark-mode' : 'light-mode';
        body.className = newTheme;
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });


    function getClassification(imc) {
        if (imc < 18.5) return 'Abaixo do peso';
        if (imc >= 18.5 && imc <= 24.9) return 'Peso normal';
        if (imc >= 25.0 && imc <= 29.9) return 'Sobrepeso';
        if (imc >= 30.0 && imc <= 34.9) return 'Obesidade Grau I';
        if (imc >= 35.0 && imc <= 39.9) return 'Obesidade Grau II';
        if (imc >= 40.0) return 'Obesidade Grau III (Mórbida)';
        return 'Inválido';
    }

    function highlightTable(classification) {
        tabelaBody.querySelectorAll('tr').forEach(row => {
            row.classList.remove('highlight-row');
        });

        tabelaBody.querySelectorAll('tr').forEach(row => {
            const rowClassification = row.cells[1].textContent.trim();
            if (rowClassification.toLowerCase().includes(classification.toLowerCase().split('(')[0].trim())) {
                row.classList.add('highlight-row');
            }
        });

        if (classification === 'Abaixo do peso') {
            tabelaBody.querySelector('tr:nth-child(1)').classList.add('highlight-row');
        } else if (classification === 'Peso normal') {
            tabelaBody.querySelector('tr:nth-child(2)').classList.add('highlight-row');
        }
    }


    function calcularIMC() {
        resultadoContainer.classList.add('hidden');
        erroMensagem.textContent = '';
        tabelaBody.querySelectorAll('tr').forEach(row => row.classList.remove('highlight-row'));

        const peso = parseFloat(pesoInput.value);
        const altura = parseFloat(alturaInput.value);

        if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
            erroMensagem.textContent = 'Por favor, insira valores válidos e positivos para peso e altura.';
            return;
        }

        if (altura < 0.5 || altura > 3.0) { 
             erroMensagem.textContent = 'Altura parece inválida. Insira a altura em metros (Ex: 1.70).';
             return;
        }

        const imc = peso / (altura * altura);
        const classificacao = getClassification(imc);

        imcResultado.textContent = `IMC: ${imc.toFixed(2)} kg/m²`;
        classificacaoOutput.textContent = `Classificação: ${classificacao}`;

        highlightTable(classificacao);

        resultadoContainer.classList.remove('hidden');

        resultadoContainer.scrollIntoView({ behavior: 'smooth' });
    }

    calcularBtn.addEventListener('click', calcularIMC);

    pesoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calcularIMC();
        }
    });
    alturaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calcularIMC();
        }
    });

});