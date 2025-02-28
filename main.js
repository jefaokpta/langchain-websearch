import { WebBrowser } from "langchain/tools/webbrowser";
import { Ollama } from "@langchain/community/llms/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

async function createWebBrowserAgent(url, pergunta) {
    try {
        // Inicializa o modelo Ollama (você pode mudar o modelo conforme necessário)
        const model = new Ollama({
            model: "llama3.2", // ou outro modelo que você tenha instalado
            temperature: 0.5,
            baseUrl: "http://veia-interno.vipsolutions.com.br:11434",
        });

        // Inicializa os embeddings do Ollama
        const embeddings = new OllamaEmbeddings({
            model: "llama3.2", // use o mesmo modelo para consistência
            baseUrl: "http://veia-interno.vipsolutions.com.br:11434",
        });

        // Cria o navegador web
        const browser = new WebBrowser({ model, embeddings });

        // Faz a consulta
        const resultado = await browser.invoke(
            `"${url}","${pergunta}"`
        );

        console.log("Resultado da análise:");
        console.log(resultado);

    } catch (error) {
        console.error("Erro ao processar a página:", error);
    }
}

// Exemplo de uso
const url = process.argv[2];
const pergunta = process.argv[3] || ""; // Se não fornecer pergunta, fará um resumo geral

if (!url) {
    console.error("Por favor, forneça uma URL como argumento.");
    process.exit(1);
}

createWebBrowserAgent(url, pergunta);
