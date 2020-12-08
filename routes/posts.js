const express = require('express')

const db = require('../data/db')

const router = express.Router()

router.get('/posts', async (request, response, next) => {
    try {
        let result = await db.find()

        if (result) {
            return response.status(200).json({result})
        } else {
            return response.status(404).json({"message": "not found"})
        }
    } catch (error) {
        return response.status(500).json({"error": "something went wrong"})
    }
})

router.get('/posts/:id', async (request, response, next) => {
    let id = request.params.id

    try {
        let result = await db.findById(id)

        if (result.length > 0) {
            return response.status(200).json({result})
        } else {
            return response.status(404).json({"message": "not found"})
        }
    } catch (error) {
        return response.status(500).json({"error": "something went wrong"})
    }
})

router.get('/posts/:id/comments', async (request, response, next) => {
    let id = request.params.id

    let post = await db.findById(id)

    if(post.length > 0) {
        try {
            let result = await db.findPostComments(id)

            if (result) {
                return response.status(200).json({result})
            } else {
                return response.status(404).json({"message": "not found"})
            }
        } catch (error) {
            return response.status(500).json({"error": "something went wrong"})
        }
    } else {
        return response.status(404).json({"message": "post not found"})
    }
})

router.post('/posts', async (request, response, next) => {
    let data = {
        title: request.body.title,
        contents: request.body.contents
    }

    if (data.title && data.contents) {
        try {
            let result = await db.insert(data)
            return response.status(201).json(result)
        } catch (error) {
            return response.status(500).json({"error": "something went wrong"})
        }
    } else {
        return response.status(400).json({"message": "title or contents missing"})
    }
})

router.post('/posts/:id/comments', async (request, response, next) => {
    let id = request.params.id

    let data = {
        text: request.body.text,
        post_id: id
    }

    let post = await db.findById(id)

    if (post.length > 0) {
        if (data.text) {
            try {
                let result = await db.insertComment(data)
                return response.status(201).json(result)
            } catch (error) {
                return response.status(500).json({"error": "something went wrong"})
            }
        } else {
            return response.status(400).json({"message": "missing text"})
        }
    } else {
        return response.status(404).json({"message": "post not found"})
    }
})

router.put('/posts/:id', async (request, response, next) => {
    let id = request.params.id

    let data = {
        title: request.body.title,
        contents: request.body.contents
    }

    let post = await db.findById(id)

    if (post.length > 0) {
        if (data.title && data.contents) {
            try {
                let result = await db.update(id, data)
                return response.status(201).json(result)
            } catch (error) {
                return response.status(500).json({"error": "something went wrong"})
            }
        } else {
            return response.status(400).json({"message": "title or contents missing"})
        }
    } else {
        return response.status(404).json({"message": "post not found"})
    }
})

router.delete('/posts/:id', async (request, response, next) => {
    let id = request.params.id

    let post = await db.findById(id)

    if(post.length > 0) {
        try {
            let result = await db.remove(id)

            return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({"error": "something went wrong"})
        }
    } else {
        return response.status(404).json({"message": "post not found"})
    }
})

module.exports = router
