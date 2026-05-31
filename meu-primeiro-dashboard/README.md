# 🎓 Facult - Portal de Gestão e Análise Acadêmica

O **Facult** é um ecossistema frontend completo e inteligente projetado para centralizar o controle de notas, monitorar a assiduidade e simplificar o acompanhamento de metas estudantis. Desenvolvido com uma interface moderna em *Dark Mode* e efeitos de *Glassmorphism*, a aplicação transforma dados brutos de avaliações em insights visuais em tempo real para tomada de decisão acadêmica.

---

## 🛠️ Tecnologias e Ferramentas Utilizadas

O projeto foi construído utilizando as melhores práticas do mercado, com foco em performance, tipagem estrita e componentização:

* **React** (Gerenciamento de estado reativo e arquitetura baseada em componentes reutilizáveis)
* **TypeScript** (Tipagem estática estrita para modelagem de dados e prevenção de bugs em tempo de compilação)
* **Tailwind CSS** (Estilização utilitária avançada, layouts responsivos e efeitos visuais customizados)
* **Recharts** (Biblioteca de gráficos de alta performance para plotagem analítica de dados)
* **LocalStorage** (Persistência de dados local no lado do cliente, eliminando a necessidade de sessões de carregamento e autenticação externa)

---

## 🧠 Engenharia de Software e Diferenciais Técnicos

O Facult não é apenas uma interface bonita; ele implementa conceitos robustos de engenharia de software e regras de negócios complexas:

### 1. Motor de Cálculo Multi-Algoritmo
O sistema suporta duas metodologias distintas de avaliação, adaptando-se a critérios de diferentes disciplinas universitárias:
* **Média Aritmética:** A clássica soma das notas dividida pela quantidade de atividades.
* **Média Harmônica:** Algoritmo comum em disciplinas de exatas e computação que penaliza severamente o estudante caso ele obtenha uma nota muito baixa ou zerada em alguma avaliação, empurrando a média final para baixo.

### 2. Fluxo Reativo e Edição *In-Place*
Em vez de depender de modais complexos ou navegações custosas, a aplicação utiliza o estado reativo do React para permitir a edição de notas diretamente nos cards do Dashboard Principal. No milissegundo em que o usuário altera uma nota de atividade (`A1, A2, A3`), o sistema dispara um recálculo em cascata:
1. Atualiza a **Média Consolidada** da disciplina.
2. Atualiza a **Escala de Letras do Conceito** ($A, B, C$ ou $D$).
3. Atualiza o **Gráfico de Progresso** horizontal e o **GPA Geral (Média Geral)** da aplicação.
4. Sincroniza silenciosamente a nova estrutura de objetos no `LocalStorage`.

### 3. Layout Dinâmico e Controle de View
Na aba de gerenciamento, o usuário pode alternar de forma reativa a exibição das disciplinas entre **Grid** (visão espacial focada em cards informativos) e **Lista** (visão linear otimizada para listagens longas), manipulando classes do Tribunal dinamicamente através de estados do React.

---

## 🎨 Arquitetura de Telas (Design do Ecossistema)

A aplicação é dividida em um fluxo de três colunas (Bento Grid) e se organiza em abas operacionais controladas centralizadamente:

1. **Dashboard (Home):** Painel de Metas Vivas contendo o gráfico de progresso por disciplina (alinhado perfeitamente à esquerda para máxima legibilidade), cartões de KPIs em tempo real (GPA, Frequência por anel SVG nativo) e o editor vivo de notas.
2. **Disciplinas (Gestão):** Formulário configurador que gera distribuições dinâmicas de pesos em porcentagem de forma automatizada (garantindo que a soma resulte sempre em exatamente $100\%$) integrado à listagem de remoção.
3. **Gráficos (Analytics Semestral):** Gráfico de área responsivo com preenchimento em degradê neon que compara a evolução temporal do estudante contra a média geral do curso e linhas de referência de corte de aprovação (Meta $6.0$).

---

## 💻 Como Executar o Projeto Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina antes de começar.

```bash
# 1. Clonar o repositório
git clone [https://github.com/seu-usuario/facult.git](https://github.com/seu-usuario/facult.git)

# 2. Entrar no diretório do projeto
cd facult

# 3. Instalar as dependências do ecossistema
npm install

# 4. Iniciar o servidor local de desenvolvimento (Vite)
npm run dev