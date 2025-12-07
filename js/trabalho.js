document.addEventListener('DOMContentLoaded', function() {

    const STORAGE_KEY = 'tarefasKanban';
    
    const btnNovaTarefa = document.getElementById('nova_tarefa'); 
    const modal = document.getElementById('cadastro');
    const spanFechar = document.getElementById('span2');
    const formTarefa = document.getElementById('form_nova_tarefa'); 

    const colFazer = document.querySelector('.fazer');
    const colFazendo = document.querySelector('.fazendo');
    const colFeito = document.querySelector('.feito');

    let tarefas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let tarefaAtualId = null; 

    function abrirModal(criar=true, id=null) {
        modal.style.display = 'flex';
        formTarefa.reset();
        tarefaAtualId = null;
        if(!criar && id) {
            const t = tarefas.find(item => item.id == id);
            if(t) {
                document.getElementById('abrir').value = t.id;
                document.getElementById('nome_tarefa').value = t.titulo;
                document.getElementById('descricao_tarefa').value = t.descricao;
                document.getElementById('prioridade_tarefa').value = t.prioridade;
                document.getElementById('data_tarefa').value = t.data;
                tarefaAtualId = t.id;
            }
        }
    }

    function fecharModalFunc() {
        modal.style.display = 'none';
    }

    btnNovaTarefa.addEventListener('click', () => abrirModal());
    spanFechar.addEventListener('click', fecharModalFunc);
    window.addEventListener('click', e => { if(e.target === modal) fecharModalFunc(); }); 

    formTarefa.addEventListener('submit', function(e) {
        e.preventDefault();

        const titulo = document.getElementById('nome_tarefa').value.trim();
        const descricao = document.getElementById('descricao_tarefa').value.trim();
        const prioridade = document.getElementById('prioridade_tarefa').value;
        const data = document.getElementById('data_tarefa').value;

        if(!titulo || !descricao) return;

        if(tarefaAtualId) {
            tarefas.forEach(t => {
                if(t.id == tarefaAtualId){
                    t.titulo = titulo;
                    t.descricao = descricao;
                    t.prioridade = prioridade;
                    t.data = data;
                }
            });
        } else {
            const nova = {
                id: Date.now(),
                titulo,
                descricao,
                prioridade,
                data,
                status: 'todo'
            };
            tarefas.push(nova);
        }

        salvarRenderizar();
        fecharModalFunc();
    });

    function criarCard(tarefa){
        const card = document.createElement('div');
        card.className = 'task-card prioridade-' + tarefa.prioridade;
        card.dataset.id = tarefa.id;
        card.innerHTML = `
            <h4>${tarefa.titulo}</h4>
            <p>${tarefa.descricao}</p>
            <div class="task-meta">
                <span>Prioridade: ${tarefa.prioridade}</span>
                <span>Data: ${tarefa.data || '---'}</span>
            </div>
            <div class="task-actions">
                <button class="editar">Editar</button>
                <button class="excluir">Excluir</button>
                <button class="mover">Mover</button>
            </div>
        `;

        card.querySelector('.editar').addEventListener('click', () => abrirModal(false, tarefa.id));

        card.querySelector('.excluir').addEventListener('click', () => {
            tarefas = tarefas.filter(t => t.id != tarefa.id);
            salvarRenderizar();
        });

        card.querySelector('.mover').addEventListener('click', () => {
            if(tarefa.status == 'todo') tarefa.status = 'doing';
            else if(tarefa.status == 'doing') tarefa.status = 'done';
            else tarefa.status = 'todo';
            salvarRenderizar();
        });

        return card;
    }

    function renderizarTarefas() {
        colFazer.innerHTML = '';
        colFazendo.innerHTML = '';
        colFeito.innerHTML = '';

        tarefas.forEach(t => {
            const card = criarCard(t);
            if(t.status == 'todo') colFazer.appendChild(card);
            else if(t.status == 'doing') colFazendo.appendChild(card);
            else colFeito.appendChild(card);
        });
    }

    function salvarRenderizar(){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
        renderizarTarefas();
    }

    renderizarTarefas();

});
