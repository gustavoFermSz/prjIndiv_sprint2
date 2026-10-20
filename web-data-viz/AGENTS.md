# AGENTS.md

## Visão geral

Este projeto se dedica à criação de um portal/blog para pessoas que gostem de diferentes mundos fantasiosos, desde RPGs medievais disponibilizados em diferentes mídias até livros de ficção distópicos, como que reunindo pessoas em torno de interesses semelhantes e não muito específicos (como seria focar somente em uma obra ou mundo fictício, por ex.). Por não ser nada inovador, é mais uma opção para quem se encaixa no público-alvo da aplicação e um bom desafio para quem for montar esse sistema, que terá como foco a disponibilização de informações/curiosidades gerais ou de acontecimentos/experiências pessoais no contexto da obra e a interação entre diferentes pessoas dentro do site ao visualizar o que outros postam (ainda não tenho intenção de fazer um sistema de comentários para uma publicação, ams talvez faça algo mais simples, de reações, utilizando emojis ou coisa semelhante). Haverá dois tipos de usuário: o padrão - cliente que cria (e talvez interage com) publicações na aplicação - e o administrador, que terá poder de remover variados tipos de publicações (posts, reações se houver) mesmo que não sejam as dele, atuando como moderador do portal.

## Tecnologias

Este projeto de portal com dados dinâmicos será implementado na estrutura rota-controller-model via Node.Js, programado na linguagem JavaScript, com estrutura e estilização em HTML + CSS (com uso de fontes pela API do Google), ligação a uma base de dados em MySQL via API web-data-viz (Link do repositório original: 'https://github.com/BandTec/web-data-viz.git') e potencialmente com auxílio de agentes de IA via plataforma opencode para criação/codificação do sistema.

## Comandos

Para o agente:
- indique... Significa que se deve apenas procurar o que se pediu e devolver uma resposta em texto no prompt, sem fazer alterações nos arquivos da aplicação;
- crie... Significa que eu desejo que o agente crie algo (que pode ou não ser especificado) com base numa tarefa a ser realizada por meio da criação desse algo;
- modifique... Significa que o agente deve fazer alterações no que foi pedido e seguir o mais fielmente o prompt possível enquanto fizer isso, parando a operação para tirar dúvidas caso considere de suma importância para a assertividade do resultado entregue por meio de sua atuação no contexto do sistema.
Esses NÃO são todos os comandos que eu poderei dar ao agente, servem apenas como uma bússola comportamental para casos mais usuais, também visando diminuir a repetitividade dos prompts.

Quanto ao projeto e sua aplicação:
Comandos node: npm instal ou npm i para a instalação inicial de arquivos necessários para o funcionamento da API na qual se fundamenta o sistema (web-data-viz), npm run dev para rodar a aplicação em ambiente voltado para desenvolvimento e npm start para rodar a aplicação de forma mais semelhante a como seria em sua utilização por um usuário padrão do site.

Quanto à atualização do repositório remoto e versionamento do projeto:
git status - verificar se o repositório local possui modificações não compartilhadas que o diferenciem do repositório remoto.
git add . - adicionar as modificações, caso haja, a um pacote de alterações que posteriormente será descrito e então enviado ao repositório remoto.
git commit -m'' - adiciona uma mensagem (preferencialmente descritiva) ao pacote atualmente preenchido de modificações e "fecha" esse pacote de modificações, preparando-o para envio e salvando-o localmente na sua máquina.
git pull - caso haja modificações no repositório remoto que se queira manter e trazer para o repositório local, este comando executa exatamente isso, devendo-se ter cautela para não sobrescrever alterações locais que não tenham passado pelos estágios anteriores ao realizá-lo.
git push - pega o conteúdo do(s) pacote(s) commitado(s) localmente e o(s) "lança" para o repositório remoto, tornando-os equivalentemente atualizados.

## Arquitetura

O diretório public contém tudo de visível (HTML, CSS, imagens) e uma parte da lógica (JavaSript) por trás do sistema, dividindo esses tipos de arquivos em pastas dedicadas sempre que necessário, exceto quando os códigos JS forem muito ligados a uma página HTML, assim ficando dentro do arquivo da página. Também as principais telas do site podem ficar fora de pastas específicas dentro do repositório public, para facilitar seu acesso tanto pelo desenvolvedor quanto por rotas em/para outros arquivos e diretórios. 
Já o diretório src opera toda a lógica que traz dinamicidade e persistência de dados para a aplicação, no fluxo rotas-->controllers-->models-->config.js(conexão para o banco de dados em MySQL), as rotas interconectando a parte de requisições de dados dos diferentes setores visíveis ou não pelo usuário final, os controllers delimitando/validando o que não pôde ser filtrado (no código JS dentro dos arquivos de cada página HTML) dos dados antes de seu o envio por uma rota, as models responsáveis pela estrutura das querys em si para passar os dados já verificados ao banco de dados corretamente e este último arquivo com as credenciais necessárias para fazer requisições montadas anteriormente no banco de dados.

Novos arquivos criados pelo agente devem seguir o raciocínio dessa estrutura já montada.

## Padrões de desenvolvimento

- Utilizar const por padrão e let apenas quando houver necessidade de reatribuição.
Neste projeto, tanto nomes de arquivos quanto de variáveis e funções devem seguir o modelo camelCase, sendo um sucinto e os outros o mais aotoexplicativos possível, respectivamente. Nomes de diretórios preferencialmente terão uma só palavra, adotando o padrão snake_case em caso contrário.

## Cuidados e restrições

Vale ressaltar que este projeto é realizado por um aluno de primeiro semestre do curso de Análise e Desenvolvimento de Sistemas pela São Paulo Tech School e que, portanto, não se deve implementar funcionalidades ou métodos complexos ou de nível profissional/científico-acadêmico neste programa, uma vez que o aluno em questão não tem praticamente nenhum conhecimento aprofundado da estrutura de um site web dinâmico.
Não copie códigos de diretórios licenciados por terceiros, utilize apenas estruturas e métodos básicos, informando sempre que essa delimitação implicar num certo nível de má-prática, pois haverá margem para aceitação desses cenários devido ao escopo supracitado.
Os arquivos constantes em .gitignore não devem ser modificados pelo agente de IA.


## Regra geral: 
Antes de implementar uma alteração, siga as tecnologias, arquitetura, convenções e restrições descritas neste documento. Caso alguma informação esteja ausente, analise o código existente e siga os padrões já adotados no projeto.
A cada alteração realizada por si, deve-se gerar um relatório simples no próprio prompt contendo: necessidade que se tratou ao realizá-la, quais arquivos foram alterados/adicionados/removidos, o que exatamente foi feito (ex.: criação de um botão HTML com ícone de uma caneta, utilizando ícone da web e estilo CSS externo no diretório, no topo da janela de um post visível a seu publicador, o qual abre o post na função de edição, realizada via JS na ordem "rota, controller e model" e ligada ao banco de dados como update na tabela "publicacao", de seu conteúdo, além de um botão vermelho com o X para descartar essas alterações e impedi-las de serem realizadas e sair dessa janela de edição.), e qual o funcionamento esperado dessa funcionalidade/alteração no sistema. Caso já tenha um bloco ou blocos de código dedicados a suprir essa necessidade e eu diga que desejo mudá-los, informe também por que a forma como estavam não atendia totalmente ao que se pede, do contrário, avise brevemente se de fato desejo prosseguir com esse pedido, sabendo que haverá necessidade de alterar ou sobrescrever esse(s) trecho(s) de código.