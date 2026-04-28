// Salón de Eventos — Shared Data Layer (localStorage)
(function () {
  const KEYS = {
    reservations: 'salon_reservas_v3',
    services:     'salon_services_v3',
    gallery:      'salon_gallery_v3',
    config:       'salon_config_v3'
  };

  function pad(n){ return String(n).padStart(2,'0'); }
  function thisMonth(d){ const n=new Date(); return `${n.getFullYear()}-${pad(n.getMonth()+1)}-${pad(d)}`; }

  function seedReservations(){
    return [
      {id:'RES-001',date:thisMonth(8),timeStart:'18:00',timeEnd:'23:00',eventType:'Boda',persons:180,services:['catering','decoracion'],clientName:'María García Flores',clientDNI:'47382910',clientEmail:'mgarcia@gmail.com',clientPhone:'987654321',status:'confirmada',paymentMethod:'tarjeta',totalAmount:24500,notes:'Mesa de honor para 20 personas',createdAt:'2025-04-01'},
      {id:'RES-002',date:thisMonth(15),timeStart:'19:00',timeEnd:'00:00',eventType:'Corporativo',persons:120,services:['dj'],clientName:'Carlos Mendoza Ríos',clientDNI:'20384756',clientEmail:'cmendoza@empresa.pe',clientPhone:'976543210',status:'confirmada',paymentMethod:'yape',totalAmount:12800,notes:'Necesita proyector HD',createdAt:'2025-04-05'},
      {id:'RES-003',date:thisMonth(22),timeStart:'17:00',timeEnd:'23:00',eventType:'Quinceañero',persons:250,services:['catering','dj','fotografo','decoracion'],clientName:'Ana Torres Vega',clientDNI:'55678234',clientEmail:'atorresvega@hotmail.com',clientPhone:'965432109',status:'pendiente',paymentMethod:'plin',totalAmount:38200,notes:'Temática París',createdAt:'2025-04-10'},
      {id:'RES-004',date:thisMonth(28),timeStart:'20:00',timeEnd:'01:00',eventType:'Cóctel',persons:80,services:['decoracion'],clientName:'Jorge Salas Huamán',clientDNI:'33912847',clientEmail:'jsalas@outlook.com',clientPhone:'954321098',status:'pendiente',paymentMethod:'yape',totalAmount:9600,notes:'',createdAt:'2025-04-12'},
      {id:'RES-005',date:thisMonth(5),timeStart:'18:00',timeEnd:'23:00',eventType:'Boda',persons:200,services:['catering','dj','fotografo'],clientName:'Lucía Paredes Quispe',clientDNI:'71234567',clientEmail:'lparedes@gmail.com',clientPhone:'912345678',status:'cancelada',paymentMethod:'tarjeta',totalAmount:31000,notes:'Cancelada por el cliente',createdAt:'2025-03-20'},
    ];
  }

  function seedServices(){
    return [
      {id:'catering',   name:'Catering premium',       desc:'Menú gourmet de 5 tiempos con chef ejecutivo',         price:45,   unit:'per_person', active:true,  icon:'🍽️'},
      {id:'decoracion', name:'Decoración floral',       desc:'Arreglos florales y centros de mesa exclusivos',        price:800,  unit:'flat',       active:true,  icon:'💐'},
      {id:'dj',         name:'DJ & sonido profesional', desc:'Equipo de sonido premium y DJ experimentado',           price:600,  unit:'flat',       active:true,  icon:'🎵'},
      {id:'fotografo',  name:'Fotógrafo profesional',   desc:'Cobertura fotográfica completa del evento',             price:900,  unit:'flat',       active:true,  icon:'📷'},
      {id:'video',      name:'Videógrafo',              desc:'Video cinematográfico con edición profesional',         price:1200, unit:'flat',       active:false, icon:'🎥'},
      {id:'orquesta',   name:'Orquesta en vivo',        desc:'Orquesta de 8 músicos para toda la noche',              price:3500, unit:'flat',       active:true,  icon:'🎺'},
      {id:'valet',      name:'Valet parking',           desc:'Servicio de estacionamiento con asistentes uniformados',price:400,  unit:'flat',       active:true,  icon:'🚗'},
    ];
  }

  function seedGallery(){
    return [
      {src:'uploads/1.avif',caption:'Cóctel & Celebración'},
      {src:'uploads/4.avif',caption:'Jardín con Pérgola'},
      {src:'uploads/3.avif',caption:'Mesa de Honor — Bodas'},
      {src:'uploads/2.avif',caption:'Salón Quinceañero'},
      {src:'uploads/5.avif',caption:'Fachada del Local'},
    ];
  }

  const BASE_PRICES = { Boda:30, Corporativo:22, Quinceañero:26, 'Cóctel':18 };

  window.SalonDB = {
    // ── Reservas ──
    getReservations(){ const s=localStorage.getItem(KEYS.reservations); if(!s){const d=seedReservations();this.saveReservations(d);return d;} return JSON.parse(s); },
    saveReservations(d){ localStorage.setItem(KEYS.reservations,JSON.stringify(d)); },
    addReservation(r){ const d=this.getReservations(); d.push(r); this.saveReservations(d); },
    updateReservation(id,u){ const d=this.getReservations(); const i=d.findIndex(r=>r.id===id); if(i>=0){d[i]={...d[i],...u};this.saveReservations(d);} },
    deleteReservation(id){ const d=this.getReservations().filter(r=>r.id!==id); this.saveReservations(d); },

    // ── Servicios ──
    getServices(){ const s=localStorage.getItem(KEYS.services); if(!s){const d=seedServices();this.saveServices(d);return d;} return JSON.parse(s); },
    saveServices(d){ localStorage.setItem(KEYS.services,JSON.stringify(d)); },

    // ── Galería ──
    getGallery(){ const s=localStorage.getItem(KEYS.gallery); if(!s){const d=seedGallery();this.saveGallery(d);return d;} return JSON.parse(s); },
    saveGallery(d){ localStorage.setItem(KEYS.gallery,JSON.stringify(d)); },

    // ── Config ──
    getConfig(){ const s=localStorage.getItem(KEYS.config); return s?JSON.parse(s):{venueName:'Salón de Eventos',phone:'+51 999 999 999',address:'Av. Túpac Amaru, Comas, Lima',whatsapp:'51999999999'}; },
    saveConfig(d){ localStorage.setItem(KEYS.config,JSON.stringify(d)); },

    // ── Helpers ──
    generateId(){ const d=this.getReservations(); return 'RES-'+String(d.length+1).padStart(3,'0'); },
    generateCode(){ return 'EVT-'+Math.random().toString(36).substr(2,6).toUpperCase(); },

    getDateStatus(dateStr){
      const r=this.getReservations().find(r=>r.date===dateStr&&r.status!=='cancelada');
      if(!r) return 'available';
      if(r.status==='confirmada') return 'reserved';
      return 'pending';
    },
    getReservationByDate(dateStr){ return this.getReservations().find(r=>r.date===dateStr&&r.status!=='cancelada')||null; },

    // ── Clientes (derivado) ──
    getClients(){
      const map={};
      this.getReservations().forEach(r=>{
        if(!map[r.clientEmail]) map[r.clientEmail]={name:r.clientName,email:r.clientEmail,phone:r.clientPhone,dni:r.clientDNI,events:[],totalSpent:0};
        map[r.clientEmail].events.push({id:r.id,date:r.date,type:r.eventType,amount:r.totalAmount,status:r.status});
        if(r.status!=='cancelada') map[r.clientEmail].totalSpent+=r.totalAmount;
      });
      return Object.values(map);
    },

    // ── Estadísticas del mes ──
    getMonthStats(){
      const n=new Date(); const month=`${n.getFullYear()}-${pad(n.getMonth()+1)}`;
      const all=this.getReservations().filter(r=>r.date.startsWith(month));
      const confirmed=all.filter(r=>r.status==='confirmada');
      const income=confirmed.reduce((s,r)=>s+r.totalAmount,0);
      const daysInMonth=new Date(n.getFullYear(),n.getMonth()+1,0).getDate();
      const occupancy=Math.round((all.filter(r=>r.status!=='cancelada').length/daysInMonth)*100);
      // Next 7 days
      const today=n.toISOString().slice(0,10);
      const in7=new Date(n.getTime()+7*86400000).toISOString().slice(0,10);
      const upcoming=this.getReservations().filter(r=>r.date>=today&&r.date<=in7&&r.status!=='cancelada');
      return {total:all.length,confirmed:confirmed.length,pending:all.filter(r=>r.status==='pendiente').length,cancelled:all.filter(r=>r.status==='cancelada').length,income,occupancy,upcoming};
    },

    // ── Precio ──
    calcPrice(eventType,persons,serviceIds){
      const services=this.getServices();
      const base=(BASE_PRICES[eventType]||22)*persons;
      const extras=serviceIds.reduce((s,sid)=>{
        const sv=services.find(x=>x.id===sid);
        if(!sv) return s;
        return s+(sv.unit==='per_person'?sv.price*persons:sv.price);
      },0);
      const sub=base+extras;
      return {base,extras,sub,igv:Math.round(sub*0.18),total:Math.round(sub*1.18)};
    },

    fmt(n){ return 'S/ '+Math.round(n).toLocaleString('es-PE'); }
  };
})();
