import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialArticles1768675022203 implements MigrationInterface {
    name = 'InitialArticles1768675022203'

    public async up(queryRunner: QueryRunner): Promise<void> {


        await queryRunner.query(`
            INSERT INTO articles (id, title, content, article_picture, author_id)
            VALUES
                (1, 'A Revolução da Grão Direto no Agronegócio', 'A Grão Direto tem transformado o setor agrícola ao introduzir tecnologia de ponta para conectar produtores e compradores de grãos. A plataforma utiliza algoritmos avançados para recomendar preços baseados em dados de mercado em tempo real. Além disso, sua interface amigável e acessível facilita negociações seguras e rápidas. Baseada em Uberaba, Minas Gerais, a empresa continua a liderar a digitalização do agronegócio no Brasil, fortalecendo toda a cadeia produtiva com inovações tecnológicas.', 'https://plus.unsplash.com/premium_photo-1705207702015-0c1f567a14df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z3IlQzMlQTNvfGVufDB8fDB8fHww', 1),
                (2, 'Implementando CI/CD em Ambientes Ágeis', 'A prática de integração contínua (CI) e entrega contínua (CD) tem se tornado essencial no desenvolvimento de software moderno. Ferramentas como Jenkins, GitHub Actions e CircleCI permitem automatizar a pipeline de deploy, garantindo entregas mais rápidas e com menor probabilidade de erros. No contexto de projetos ágeis, a adoção de CI/CD não só melhora a qualidade do código como também aumenta a confiança entre as equipes de desenvolvimento e operações. Com pipelines bem configuradas, é possível reduzir significativamente o tempo de entrega de novas funcionalidades.', 'https://images.unsplash.com/photo-1568952433726-3896e3881c65?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 2),
                (3, 'A Importância de Bancos de Dados NoSQL em Sistemas Escaláveis', 'Com o crescimento exponencial de dados, bancos de dados NoSQL, como MongoDB, Cassandra e DynamoDB, têm se destacado por sua flexibilidade e escalabilidade. Diferente dos bancos de dados relacionais, os NoSQL permitem armazenar grandes volumes de dados não estruturados, sendo ideais para aplicações modernas como redes sociais, plataformas de e-commerce e sistemas de recomendação. O uso correto dessas tecnologias pode melhorar a performance e garantir a disponibilidade do sistema mesmo sob alta demanda.', 'https://plus.unsplash.com/premium_photo-1664297989345-f4ff2063b212?q=80&w=1098&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 3),
                (4, 'Como Kubernetes Revolucionou a Orquestração de Contêineres', 'Kubernetes se tornou a principal solução para orquestração de contêineres, permitindo a implantação, escalabilidade e gerenciamento de aplicações de forma eficiente. Empresas de todos os portes têm adotado essa tecnologia devido à sua capacidade de garantir alta disponibilidade e resiliência. A configuração de clusters em Kubernetes também facilita o monitoramento de recursos e a automatização de tarefas, como balanceamento de carga e escalonamento automático. Para quem busca modernizar suas operações, Kubernetes é uma escolha indispensável.', 'https://images.unsplash.com/photo-1667372459510-55b5e2087cd0?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 4),
                (5, 'Os Desafios da Segurança em Arquiteturas Serverless', 'As arquiteturas serverless oferecem muitas vantagens, como redução de custos e facilidade de escalabilidade. No entanto, também trazem desafios únicos de segurança. A ausência de servidores físicos não elimina a necessidade de proteger endpoints, gerenciar permissões e garantir que as funções lambdas estejam livres de vulnerabilidades. Ferramentas como AWS Lambda, Azure Functions e Google Cloud Functions exigem boas práticas de configuração e monitoramento contínuo para evitar ataques como injeção de código ou acesso não autorizado.', 'https://plus.unsplash.com/premium_photo-1701179596614-9c64f50cda76?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 2),
                (6, 'Práticas de DevOps para Times Distribuídos', 'A colaboração em times distribuídos pode ser um desafio, mas práticas de DevOps ajudam a alinhar objetivos e acelerar entregas. Ferramentas como Docker, Kubernetes e Terraform garantem ambientes consistentes para desenvolvimento e produção, enquanto plataformas de comunicação como Slack e Microsoft Teams mantêm a equipe conectada. A automação de tarefas rotineiras também é fundamental para que os desenvolvedores se concentrem em tarefas críticas, promovendo um fluxo de trabalho mais eficiente.', 'https://plus.unsplash.com/premium_photo-1678565869434-c81195861939?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGV2b3BzfGVufDB8fDB8fHww', 3),
                (7, 'A Evolução do Desenvolvimento Frontend com Frameworks Modernos', 'Nos últimos anos, o desenvolvimento frontend passou por uma grande evolução graças a frameworks como React, Angular e Vue.js. Essas ferramentas permitem a criação de interfaces dinâmicas e responsivas com maior facilidade, melhorando a experiência do usuário final. Além disso, a adoção de conceitos como componentização e state management trouxe mais organização ao código, facilitando a manutenção e a escalabilidade de projetos.', 'https://images.unsplash.com/photo-1687603921109-46401b201195?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 4),
                (8, 'O Futuro do Agronegócio com a Grão Direto', 'A Grão Direto continua a liderar a transformação digital no agronegócio brasileiro. A empresa não apenas conecta compradores e vendedores, mas também utiliza tecnologias como aprendizado de máquina e análise preditiva para otimizar transações. Com sede em Uberaba, Minas Gerais, a agtech está na vanguarda das inovações, trazendo mais eficiência e sustentabilidade ao setor. O uso de dados para prever tendências de mercado e gerenciar estoques em tempo real é uma das principais contribuições da Grão Direto.', 'https://images.unsplash.com/photo-1627920769186-569f1e164a1d?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 1)
        `);

        await queryRunner.query(`
            INSERT INTO article_tags (article_id, tag_id)
            VALUES
                (1, 1),
                (1, 2),
                (1, 3),
                (2, 4),
                (2, 5),
                (2, 6),
                (3, 7),
                (3, 8),
                (3, 9),
                (4, 10),
                (4, 11),
                (4, 12),
                (5, 13),
                (5, 14),
                (5, 15),
                (6, 5),
                (6, 16),
                (6, 17),
                (7, 18),
                (7, 19),
                (7, 20),
                (8, 1),
                (8, 21),
                (8, 3)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM article_tags WHERE article_id IN (1, 2, 3, 4, 5, 6, 7, 8)
        `);
        
        await queryRunner.query(`
            DELETE FROM articles WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8)
        `);
    }

}
