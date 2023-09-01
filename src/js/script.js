document.addEventListener("DOMContentLoaded", function () {

  const mouth = [
    'Janeiro', 
    'Fevereiro', 
    'Março', 
    'Abril', 
    'Maio', 
    'Junho', 
    'Julho', 
    'Agosto', 
    'Setembro', 
    'Outubro', 
    'Novembro', 
    'Dezembro'
  ]

  let heightScreen = $(window).height()
  $('.section').height(heightScreen);

  listEvent();

  $('.buttonActionTwo').click(() => scroll(2));
  $('.buttonActionTree').click(() => scroll(3));
  $('.buttonActionOne').click(() => scroll(1));
  $('.create').click(() => register());

  function scroll(section){
    if(section === 2){
      $('html, body').animate({scrollTop: heightScreen}, '500');
      return;
    } else if (section === 3){
      $('html, body').animate({scrollTop: heightScreen*2}, '500');
      return;
    }
    $('html, body').animate({scrollTop: 0}, '800');
  }

  function listEvent(){
    fetch('http://localhost:8000/event', { method: 'GET' })
    .then(response => response.json())
    .then(result => {
      mountListCard(result.data);
    })
    .catch(() => {
      window.alert('Ocorreu um erro ao listar os eventos, tente novamente :(')
    })
  }

  async function register(){
    let name = document.querySelector(`input[name='name']`).value;
    let dayEvent = document.querySelector(`input[name='dayEvent']`).value;
    let initHour = document.querySelector(`input[name='initHour']`).value;
    let finishHour = document.querySelector(`input[name='finishHour']`).value;
    let description = document.querySelector(`textarea[name='description']`).value;

    if(!validate(initHour, finishHour)){
      return;
    }

    if(name === '' || dayEvent === '' || initHour === '' || finishHour === '' || description === '')
    {
      window.alert('Todos os campos são obrigatórios');
      return;
    }

    const data = {
			name,
			dayEvent,
			initHour,
			finishHour,
			description
		};

    fetch('http://localhost:8000/event', { 
      method: 'POST', body: JSON.stringify(data) 
    }).then(response => response.json())
    .then(result => {
      if(!result.status){
        window.alert('Ocorreu um erro ao cadastrar seu evento, tente novamente :(');
        return;
      }

      mountListCard(result.data);
      window.alert('Evento cadastrado com sucesso! :)');
      $('html, body').animate({scrollTop: heightScreen}, '500');
    })
    .catch(() => {
      window.alert('Ocorreu um erro ao cadastrar seu evento, tente novamente :(')
    })
  }

  function mountListCard(data){
    document.querySelector('.listCard').innerHTML = data.map((item) => {
      let day = item.dayEvent.split('-');
      let formatMouth = day[1];

      if(day[1].startsWith('0')){
        formatMouth = day[1].split('0')[1];
      }

      return `<div class="card" id="${item.id}">
        <div>
          <p class="day">${day[2]}</p>
        </div>
        <div class="cardContent">
          <p class="cardHeader">${mouth[formatMouth]} de ${day[0]}, das ${item.initHour.slice(0, 5)} às ${item.finishHour.slice(0, 5)}</p>
          <p>${item.name}</p>
          <p>${item.description}</p>
        </div>
        <div class="contentDropDown">
          <button class="showDropDown buttonDropDown">
            <i class="fa fa-arrow-up" style="color: #000;" id=${item.id} values='${JSON.stringify(item)}'></i>
          </button>
          <div id="dropdown-${item.id}" class="dropDown">
            <div>
              <button type="button" class="open-modal" data-open="modal1">editar</button>
              <button class="removeEvent">excluir</button>
            </div>
          </div>
        </div>
      </div>
      `
    }).join('');

  

    $('.showDropDown').click((event) => {
      const data = JSON.parse(event.target.getAttribute('values'));

      let element = document.querySelector(`#dropdown-${data.id}`).style.display;
      if(element === 'block'){
        document.querySelector(`#dropdown-${data.id}`).style.display = 'none'
        return;
      }

      document.querySelector(`#dropdown-${data.id}`).style.display = 'block';


      const closeEls = document.querySelectorAll("[data-close]");
      const openEls = document.querySelectorAll("[data-open]");
      const isVisible = "is-visible";

      for(const el of openEls) {
        el.addEventListener("click", function() {
          const modalId = this.dataset.open;
          document.getElementById(modalId).classList.add(isVisible);
          document.querySelector('.nameEdit').value = data.name;
          document.querySelector('.dayEventEdit').value = formatDate(data.dayEvent);
          document.querySelector('.initHourEdit').value = data.initHour;
          document.querySelector('.finishHourEdit').value = data.finishHour;
          document.querySelector('.descriptionEdit').value = data.description;
        });
      }

      for (const el of closeEls) {
        el.addEventListener("click", function() {
          this.parentElement.parentElement.parentElement.classList.remove(isVisible);
        });
      }

      document.addEventListener("click", e => {
        if (e.target == document.querySelector(".modal.is-visible")) {
          document.querySelector(".modal.is-visible").classList.remove(isVisible);
        }
      });

      $('.editEvent').click(() => editEvent());
      $('.removeEvent').click(() => remove());      

      function editEvent(){
        let name = document.querySelector(`.nameEdit`).value;
        let dayEvent = document.querySelector(`.dayEventEdit`).value;
        let initHour = document.querySelector(`.initHourEdit`).value;
        let finishHour = document.querySelector(`.finishHourEdit`).value;
        let description = document.querySelector(`.descriptionEdit`).value;
    
        if(!validate(initHour, finishHour)){
          return;
        }
    
        if(name === '' || dayEvent === '' || initHour === '' || finishHour === '' || description === '')
        {
          window.alert('Todos os campos são obrigatórios');
          return;
        }
    
        const response = {
          id: data.id,
          name,
          dayEvent,
          initHour,
          finishHour,
          description
        };
    
        fetch('http://localhost:8000/event', { 
          method: 'PUT', body: JSON.stringify(response) 
        }).then(response => response.json())
        .then(result => {
          if(!result.status){
            window.alert('Ocorreu um erro ao editar seu evento, tente novamente :(');
            return;
          } 
    
          el.addEventListener("click", function() {
            this.parentElement.parentElement.parentElement.classList.remove(isVisible);
          });

          mountListCard(result.data);
          window.alert('Evento editado com sucesso! :)');
          $('html, body').animate({scrollTop: heightScreen}, '500');
        })
        .catch(() => {
          window.alert('Ocorreu um erro ao editar seu evento, tente novamente :(')
        })
      } 
      
      function remove(){
        const response = {
          id: data.id
        }
        fetch('http://localhost:8000/event', { 
          method: 'DELETE', body: JSON.stringify(response) 
        }).then(response => response.json())
        .then(result => {
          if(!result.status){
            window.alert('Ocorreu um erro ao deletar seu evento, tente novamente :(');
            return;
          } 

          mountListCard(result.data);
          window.alert('Evento deletado com sucesso! :)');
          $('html, body').animate({scrollTop: heightScreen}, '500');
        })
        .catch(() => {
          window.alert('Ocorreu um erro ao editar seu deletar, tente novamente :(')
        })
      }
    });
  }

  function formatDate(date){
    const formatDate = date.split('-');
    let newDate = `${formatDate[2]}-${formatDate[1]}-${formatDate[0]}`
    return newDate;
  }

  function validate(initHour, finishHour){
    let init = initHour.split(':');
    let finish = finishHour.split(':');

    if(finish[0] < init[0]){
      window.alert('Horário final deve ser maior que o inicial');
      return false;
    }

    if(init[0] === finish[0] && init[1] > finish[1]){
      window.alert('Horário final deve ser maior que o inicial');
      return false;
    }

    if(init[0] === finish[0]){
      window.alert('Horário final e inicial não podem ser iguais');
      return false;
    }

    return true;
  }
});