//Referencias HTML:
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPendientesvAlert = document.querySelector('#lblPendientes'); 


const searchParams = new URLSearchParams(window.location.search);

if( !searchParams.has('escritorio')){
    window.location='index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText=escritorio;
divAlert.style.display = 'none';

const socket = io();


socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('ultimo-ticket', (ultimo) => {
    //lblNuevoTicket.innerText = 'Ticket ' + ultimo;
});

socket.on('tickets-pendientes',(ticketsEnCola)=>{
        if(ticketsEnCola === 0){
            lblPendientesvAlert.style.display='none';
        }else{
            lblPendientesvAlert.style.display='';
            lblPendientesvAlert.innerText=ticketsEnCola;
        }
        
    });


btnAtender.addEventListener( 'click', () => {
    
    socket.emit( 'atender-ticket', {escritorio} ,( {ok, ticket, msg} ) => {
        if(!ok){
            lblTicket.innerText = "Nadie"
            return divAlert.style.display='';
        }

        lblTicket.innerText = `Ticket ${ticket.numero}`
        

    });

});