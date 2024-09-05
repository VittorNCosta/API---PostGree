
// Adiciona um listener ao formulário para tratar o evento de submit
document.getElementById('update-funcionario-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Previene o comportamento padrão do formulário

    // Obtém os valores dos campos do formulário
    const funcionarioid = document.getElementById('funcionarioid').value;
    const primeironomefuncionario = document.getElementById('primeironomefuncionario').value;
    const sobrenomefuncionario = document.getElementById('sobrenomefuncionario').value;
    const emailfuncionario = document.getElementById('emailfuncionario').value;
    const telefonefuncionario = document.getElementById('telefonefuncionario').value;
    const cargofuncionario = document.getElementById('cargofuncionario').value;
    const datadecontratacaofuncionario = document.getElementById('datadecontratacaofuncionario').value;
    const franquiaid = document.getElementById('franquiaid').value;

    // Cria um objeto com os dados do funcionário aaa
    const funcionario = {
        primeironomefuncionario,
        sobrenomefuncionario,
        emailfuncionario,
        telefonefuncionario,
        cargofuncionario,
        datadecontratacaofuncionario,
        franquiaid
    };

    // Define a URL e o método da requisição com base na presença do ID
    const url = funcionarioid ? `http://localhost:3000/api/funcionarios/${funcionarioid}` : 'http://localhost:3000/api/funcionarios';
    const method = funcionarioid ? 'PUT' : 'POST';

    // Faz a requisição fetch para adicionar ou atualizar o funcionário 1
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(funcionario)
    })
        .then(response => response.json())
        .then(data => {
           
            document.getElementById('mensagem').innerText = funcionarioid ? 'Funcionário atualizado com sucesso!' : 'Funcionário adicionado com sucesso!';
            adicionarFuncionarioNaLista(data);
        })
        .catch(error => {
           
            console.error('Erro ao adicionar ou atualizar funcionário:', error);
            document.getElementById('mensagem').innerText = 'Erro ao adicionar ou atualizar funcionário.';
        });
});

// Função para adicionar o funcionário à lista na página
function adicionarFuncionarioNaLista(funcionario) {
    const li = document.createElement('li');
    li.innerText = `Nome: ${funcionario.primeironomefuncionario} ${funcionario.sobrenomefuncionario}, Cargo: ${funcionario.cargofuncionario}, Email: ${funcionario.emailfuncionario}, Telefone: ${funcionario.telefonefuncionario}, Data de Contratação: ${funcionario.datadecontratacaofuncionario}, Franquia ID: ${funcionario.franquiaid}`;
    document.getElementById('listaFuncionarios').appendChild(li);
}









































