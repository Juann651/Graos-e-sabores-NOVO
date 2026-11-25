# Grãos e Sabores

Loja virtual de produtos naturais (temperos, snacks, farinhas energéticas, grãos e sementes). O cliente monta o carrinho no site e finaliza o pedido pelo **WhatsApp**, com a lista de itens e o total já escritos na mensagem. Um painel para o funcionário permite gerenciar os produtos sem mexer no código.

Feito com **HTML, CSS e JavaScript puro**, sem framework.

## Funcionalidades

**Loja**
- Produtos organizados por categoria: Temperos, Snacks, Farinhas Energéticas e Grãos e Sementes
- Busca de produtos por nome
- Seletor de gramagem (50g / 100g) com cálculo automático do preço
- Controle de quantidade em cada produto
- Carrinho com total, salvo no navegador
- Botão **Finalizar** que abre o WhatsApp com o pedido pronto
- Produtos indisponíveis aparecem sinalizados
- Botões flutuantes de WhatsApp e Instagram

**Painel do funcionário (`/admin.html`)**
- Login com usuário e senha
- Cadastro, edição e exclusão de produtos
- Campos: nome, categoria, descrição curta, informação detalhada, foto, preço e gramagem
- Opção de produto com ou sem seletor de gramagem
- Marcar produto como disponível ou indisponível
- Upload de foto direto para o Cloudinary
- As alterações aparecem na loja automaticamente

## Tecnologias

- HTML5, CSS3 e JavaScript (ES6+)
- [JSONBin.io](https://jsonbin.io): armazena a lista de produtos
- [Cloudinary](https://cloudinary.com): hospedagem das fotos dos produtos
- [Vercel](https://vercel.com): hospedagem

## Estrutura

```
Graos-e-sabores-NOVO-main/
├── index.html            # loja (catálogo e carrinho)
├── admin.html            # painel do funcionário
├── script.js             # busca, carrinho, pedido via WhatsApp e sincronização com o admin
├── imagens/              # logo e ícones
├── config.js             # configuração pública (somente placeholders)
├── config.example.js     # modelo de configuração
├── build-config.js       # gera config.local.js a partir de variáveis de ambiente
└── vercel.json           # configuração de deploy na Vercel
```

## Configuração

As credenciais **não ficam no repositório**. O código lê `window.APP_CONFIG`, definido em `config.js` (placeholders) e sobrescrito por `config.local.js` (ignorado pelo Git).

### 1. Crie os serviços
1. **JSONBin:** crie uma conta, um bin para os produtos e uma API Key. Anote o Bin ID.
2. **Cloudinary:** em Settings → Upload, crie um *Upload preset* com Signing Mode **Unsigned**. Anote o cloud name e o nome do preset.

### 2. Rodando localmente
1. Copie `config.example.js` para `config.local.js`.
2. Preencha os valores reais.
3. Abra a pasta no VS Code e rode o `index.html` com a extensão **Live Server**.

### 3. Deploy na Vercel
1. Importe o repositório na Vercel (Framework Preset: **Other**). O `vercel.json` já define o comando de build.
2. Cadastre estas variáveis em Settings → Environment Variables:

| Variável | Descrição |
|---|---|
| `JSONBIN_ID` | ID do bin no JSONBin |
| `JSONBIN_KEY` | API Key do JSONBin |
| `ADMIN_USUARIO` | Usuário de acesso ao painel |
| `ADMIN_SENHA` | Senha de acesso ao painel |
| `CLOUDINARY_CLOUD` | Cloud name do Cloudinary |
| `CLOUDINARY_PRESET` | Nome do upload preset (unsigned) |

3. Faça o deploy. O `build-config.js` gera o `config.local.js` automaticamente. Se faltar alguma variável, o build falha e informa qual.

## Personalização

O número de WhatsApp que recebe os pedidos está escrito em `script.js` (variável `telefone`) e nos links de `index.html`. O link do Instagram também está no `index.html`. Troque pelos dados reais antes de publicar a sua versão.

## Segurança

Este é um projeto 100% front-end. Isso significa que:
- A chave do JSONBin e as credenciais do painel chegam ao navegador do visitante e podem ser vistas por quem inspecionar o site.
- O login do painel acontece no próprio JavaScript e **não é uma proteção forte**.

Para uso em produção com dados importantes, mova o acesso ao banco e a autenticação para um back-end (por exemplo, funções serverless da Vercel).
