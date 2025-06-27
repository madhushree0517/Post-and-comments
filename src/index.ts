import express from 'express'
import cors from 'cors'
import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()
const app = express()
app.use(cors())
app.use(express.json())

// --- POSTS ---

app.post('/posts', async (req, res) => {
  const { title, content } = req.body
  const post = await prisma.post.create({ data: { title, content } })
  res.json(post)
})

app.get('/posts', async (req, res) => {
  const posts = await prisma.post.findMany({ include: { comments: true } })
  res.json(posts)
})

app.delete('/posts/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  await prisma.comment.deleteMany({ where: { postId: id } })
  await prisma.post.delete({ where: { id } })
  res.json({ message: 'Post deleted' })
})

// --- COMMENTS ---

app.post('/comments', async (req, res) => {
  const { content, postId } = req.body
  const comment = await prisma.comment.create({ data: { content, postId } })
  res.json(comment)
})

app.get('/comments/:postId', async (req, res) => {
  const postId = parseInt(req.params.postId)
  const comments = await prisma.comment.findMany({ where: { postId } })
  res.json(comments)
})

app.delete('/comments/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  await prisma.comment.delete({ where: { id } })
  res.json({ message: 'Comment deleted' })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
