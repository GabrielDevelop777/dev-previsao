// Carregar Rio de Janeiro como padrão
window.onload = () => {
	buscarCidade("Rio de Janeiro");
};

function atualizarData() {
	const options = {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	};
	const dataAtual = new Date().toLocaleDateString("pt-BR", options);
	document.getElementById("data-atual").textContent =
		dataAtual.charAt(0).toUpperCase() + dataAtual.slice(1);
}
atualizarData();

const chave = "cebcd482eda57fa9a6714c1c2ba91885";
const msgErro = document.querySelector(".mensagem-erro");

function colocarNaTela(dados) {
	if (dados.cod === "404") {
		msgErro.innerHTML = "Cidade não encontrada. Tente novamente.";
		return;
	}

	document.querySelector(".nome-cidade").innerHTML =
		`${dados.name}, ${dados.sys.country}`;
	document.querySelector(".temperatura").innerHTML = Math.floor(
		dados.main.temp,
	);
	document.querySelector(".icone-clima").src =
		`https://openweathermap.org/img/wn/${dados.weather[0].icon}@2x.png`;
	document.querySelector(".descricao").innerHTML = dados.weather[0].description;
	document.querySelector(".sensacao-termica").innerHTML =
		`${Math.floor(dados.main.feels_like)}°C`;
	document.querySelector(".umidade").innerHTML = `${dados.main.humidity}%`;
	document.querySelector(".vento").innerHTML =
		`${Math.floor(dados.wind.speed * 3.6)} km/h`;

	// Mudar cor de fundo com base na temperatura
	const temp = dados.main.temp;
	let colorStart;
	let colorEnd;

	if (temp < 10) {
		// Frio
		colorStart = "#1e3c72";
		colorEnd = "#2a5298";
	} else if (temp < 20) {
		// Ameno
		colorStart = "#2980B9";
		colorEnd = "#6DD5FA";
	} else if (temp < 30) {
		// Quente
		colorStart = "#FF8008";
		colorEnd = "#FFC837";
	} else {
		// Muito quente
		colorStart = "#FF416C";
		colorEnd = "#FF4B2B";
	}

	document.body.style.background = `linear-gradient(135deg, ${colorStart}, ${colorEnd})`;
}

async function buscarCidade(cidade) {
	try {
		const dados = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&units=metric&lang=pt_br`,
		).then((resposta) => resposta.json());

		colocarNaTela(dados);
	} catch (error) {
		console.error("Erro ao buscar dados:", error);
		msgErro.style.display = "block";
	}
}

function cliqueiNoBotao() {
	const cidade = document.querySelector(".entrada-cidade").value;
	if (cidade) {
		buscarCidade(cidade);
	}
}

// Adicionar evento de tecla Enter
document
	.querySelector(".entrada-cidade")
	.addEventListener("keypress", (event) => {
		if (event.key === "Enter") {
			cliqueiNoBotao();
		}
	});

// Usar localização do usuário
document.querySelector(".botao-localizacao").addEventListener("click", () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			const lat = position.coords.latitude;
			const lon = position.coords.longitude;

			fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${chave}&units=metric&lang=pt_br`,
			)
				.then((resposta) => resposta.json())
				.then((dados) => colocarNaTela(dados));
		});
	}
});
