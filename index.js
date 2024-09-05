// Importa o módulo express para criar o servidor
const express = require('express');
// Importa o módulo path para lidar com caminhos de arquivos
const path = require('path');
// Importa o módulo pg para conectar ao banco de dados PostgreSQL
const { Pool } = require('pg');

// Cria uma instância do servidor Express
const app = express();
// Define a porta em que o servidor irá rodar
const port = 3000;

// Cria uma pool de conexões com o banco de dados PostgreSQL
const pool = new Pool({
    user: 'postgres', // Nome de usuário do banco de dados
    host: 'localhost', // Host do banco de dados
    database: 'mercado', // Nome do banco de dados
    password: 'vnc2003vt,', // Senha do banco de dadoshfhgd
    port: 5432, // Porta do banco de dados
});

// Middleware para analisar o corpo das requisições como JSON
app.use(express.json());
// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Servir o arquivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'funcionarios.html'));
});

/**
 * Rota para adicionar um novo funcionário
 * Método: POST
 * URL: /api/funcionarios
 */
app.post('/api/funcionarios', async (req, res) => {
    try {
        // Extrai os dados do corpo da requisição
        const { primeironomefuncionario, sobrenomefuncionario, emailfuncionario, telefonefuncionario, cargofuncionario, datadecontratacaofuncionario, franquiaid } = req.body;
        
        // Executa a query de inserção no banco de dados
        const result = await pool.query(
            'INSERT INTO funcionarios (primeironomefuncionario, sobrenomefuncionario, emailfuncionario, telefonefuncionario, cargofuncionario, datadecontratacaofuncionario, franquiaid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [primeironomefuncionario, sobrenomefuncionario, emailfuncionario, telefonefuncionario, cargofuncionario, datadecontratacaofuncionario, franquiaid]
        );

        // Retorna o novo funcionário adicionado
        res.json(result.rows[0]);
    } catch (error) {
        // Em caso de erro, loga no console e retorna uma resposta de erro
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar funcionário' });
    }
});

/**
 * Rota para atualizar um funcionário existente
 * Método: PUT
 * URL: /api/funcionarios/:id
 */
app.put('/api/funcionarios/:id', async (req, res) => {
    try {
        // Extrai o ID do funcionário dos parâmetros da URL
        const { id: funcionarioid } = req.params;
        // Extrai os dados do corpo da requisição
        const { primeironomefuncionario, sobrenomefuncionario, emailfuncionario, telefonefuncionario, cargofuncionario, datadecontratacaofuncionario, franquiaid } = req.body;
        
        /* Executa a query de upsert no banco de dados
        ON CONFLICT significa que caso já exista o id do funcionario inserido 
        ele irá atualizar os dados deste, caso não haja ele irá adicionar como um novo funcionário
        O EXCLUDED é usado para referenciar os valores que você está tentando inserir na tabela quando ocorre um conflito, neste caso o valot de funcionarioid
        EXCLUDED permite que você utilize os valores que estavam sendo inseridos originalmente para atualizar o registro existente.
        */
        const query = `
            INSERT INTO funcionarios (funcionarioid, primeironomefuncionario, sobrenomefuncionario, emailfuncionario, telefonefuncionario, cargofuncionario, datadecontratacaofuncionario, franquiaid)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (funcionarioid)
            DO UPDATE SET 
                primeironomefuncionario = EXCLUDED.primeironomefuncionario,
                sobrenomefuncionario = EXCLUDED.sobrenomefuncionario,
                emailfuncionario = EXCLUDED.emailfuncionario,
                telefonefuncionario = EXCLUDED.telefonefuncionario,
                cargofuncionario = EXCLUDED.cargofuncionario,
                datadecontratacaofuncionario = EXCLUDED.datadecontratacaofuncionario,
                franquiaid = EXCLUDED.franquiaid
            RETURNING *; 
        `;

        const values = [funcionarioid, primeironomefuncionario, sobrenomefuncionario, emailfuncionario, telefonefuncionario, cargofuncionario, datadecontratacaofuncionario, franquiaid];
            
        const result = await pool.query(query, values);

        // Retorna o funcionário adicionado ou atualizado
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Em caso de erro, loga no console e retorna uma resposta de erro
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar ou adicionar funcionário' });
    }
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
