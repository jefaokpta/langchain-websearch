import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

async function createWebBrowserAgent(url, pergunta) {
    try {
        // Inicializa o modelo Ollama (você pode mudar o modelo conforme necessário)
        const model = new ChatOllama({
            model: "llama3.2", // ou outro modelo que você tenha instalado
            temperature: 0.5,
            baseUrl: "http://192.168.15.212:11434",
        });

        // Inicializa os embeddings do Ollama
        const embeddings = new OllamaEmbeddings({
            model: "llama3.2" // use o mesmo modelo para consistência
        });

        // Cria o navegador web
        const browser = new WebBrowser({ model, embeddings });

        console.log(url, pergunta);
        // Faz a consulta
        const resultWebBrowser = await browser.invoke(
            `"${url}"`
        );

        console.log("Resultado da consulta ao navegador web:");
        console.log(resultWebBrowser);

        const prompt = new PromptTemplate({
            template: "Resuma a resposta: {resultWebBrowser}",
            inputVariables: ["resultWebBrowser"]
        });

        const formattedPrompt = await prompt.format({ resultWebBrowser });

        const result = await model.invoke(formattedPrompt);

        console.log("Resultado da análise:");
        console.log(result.content);

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
