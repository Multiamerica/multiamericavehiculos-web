//src/data/mock.ts

import { Vehicle } from "@/types/vehicle";

export const MOCK: Vehicle[] = [
  {
    vehiculo_id: "GW-0001",
    estado: "DISPONIBLE",
    marca: "Toyota",
    modelo: "Corolla",
    anio: 2020,
    precio_num: 10300,
    moneda: "USD",
    km_num: 101070,
    color: "Blanco",
    transmision: "Automático",
    traccion: "4x2",
    ubicacion: "Sede Principal",
    descripcion: "Único dueño, mantenimiento al día.",
    imagenes: ["1_portada.jpg","2_lateral.jpg","3_interior.jpg"]
  },
  {
    vehiculo_id: "GW-0002",
    estado: "PREVIA_CITA",
    marca: "Mitsubishi",
    modelo: "Montero",
    anio: 2014,
    precio_num: 15900,
    moneda: "USD",
    km_num: 139655,
    color: "Gris",
    transmision: "Automático",
    traccion: "4x4",
    ubicacion: "Depósito",
    imagenes: ["01.jpg","02.jpg"]
  },
  {
    vehiculo_id: "GW-0003",
    estado: "DISPONIBLE",
    marca: "Ford",
    modelo: "Explorer",
    anio: 2017,
    precio_num: 18900,
    moneda: "USD",
    km_num: 45200,
    color: "Negro",
    transmision: "Automático",
    traccion: "4x2",
    ubicacion: "Sede Norte",
    imagenes: ["1.jpg","2.jpg","3.jpg"]
  }
];
