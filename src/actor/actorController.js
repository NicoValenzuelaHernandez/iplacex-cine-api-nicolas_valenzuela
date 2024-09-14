import { ObjectId } from "mongodb";
import client from "../common/db.js";
import { Actor } from "./actor.js";

const actorCollection = client.db('cine-db').collection('actores')
const peliculaCollection = client.db('cine-db').collection('peliculas')

// funcion INSERT actor
async function handleInsertActorRequest(req, res) {
    let data = req.body;

    try {

        let peliculaId = ObjectId.createFromHexString(data.idPelicula);
        let pelicula = await peliculaCollection.findOne({ _id: peliculaId });
        if (pelicula === null) {
            return res.status(404).send({ message: 'Película no encontrada' });
        }

        let actor = {
            ...Actor,
            idPelicula:     pelicula._id.toString(),
            nombre:         data.nombre,
            edad:           data.edad,
            estaRetirado:   data.estaRetirado,
            premios:        data.premios
        }

        let result = await actorCollection.insertOne(actor);
        if (result === null) {
            return res.status(400).send({ message: 'Error al guardar registro' });
        }
        return res.status(201).send(result);
    } catch (e) { 
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
}

// funcion GET actoressssss
async function handleGetActoresRequest(req, res) {
    await actorCollection.find({}).toArray()
    .then((data) => { return res.status(200).send(data) })
    .catch((e) => { 
        return res.status(500).send({ code: e.code }) })
}

// funcion GET actor (por _Id)
async function handleGetActorByIdRequest(req, res) {
    let id = req.params.id

    try{
        let oid = ObjectId.createFromHexString(id)

        await actorCollection.findOne({ _id: oid })
        .then((actor) => { 
            if(actor === null) return res.status(404).send(actor)
            
            return res.status(200).send(actor)
        })
        .catch((e) => { return res.status(500).send({ code: e.code }) })

    } catch(e) {
        return res.status(400).send({ error: "Id mal formado" })
    }
}

// funcion GET actores por pelicula
async function handleGetActoresByPeliculaIdRequest(req, res) {
    let nombrePelicula = req.params.id

    try {
        // primero buscar película
        let pelicula = await peliculaCollection.findOne({ nombre: nombrePelicula })
        if (pelicula === null) {
            return res.status(404).send({ message: 'Película no encontrada' })
        }
        const peliculaId = pelicula._id.toString();

        // Buscar los actores 
        let actores = await actorCollection.find({ idPelicula: peliculaId }).toArray()

        if (actores === null) {
            return res.status(404).send({ message: 'No se encontraron actores para esta película' })
        }

        return res.status(200).send(actores)
    } catch (e) {
        return res.status(500).send({ error: 'Error interno del servidor' })
    }
}

export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
}
