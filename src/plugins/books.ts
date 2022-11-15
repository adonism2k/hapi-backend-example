import Hapi from '@hapi/hapi'
import { Prisma } from '@prisma/client'

const booksPlugin = {
  name: 'app/books',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: 'GET',
        path: '/books',
        handler: booksHandler,
      },
    ])

    server.route([
      {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookHandler,
      },
    ])

    server.route([
      {
        method: 'POST',
        path: '/books',
        handler: createBookHandler,
      },
    ])

    server.route([
      {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookHandler,
      },
    ])

    server.route([
      {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookHandler,
      },
    ])
  },
}

export default booksPlugin

async function booksHandler(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | undefined> {
  const { prisma } = request.server.app
  const { name, reading, finished } = request.query

  try {
    const books = await prisma.book.findMany({
      select: {
        id: true,
        name: true,
        publisher: true,
      },
      where: (name || reading || finished) ? {
        OR: [
          name != undefined ? { name: { contains: name } } : {},
          reading != undefined ? { reading: { equals: Boolean(Number(reading))} } : {},
          finished != undefined ? { finished: { equals: Boolean(Number(finished))} } : {},
        ]
      } : {}
    })

    return h.response({
      status: "success",
      data: {
        books
      }
    }).code(200)
  } catch (err) {
    console.log(err)
  }
}

async function getBookHandler(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | undefined> {
  const { prisma } = request.server.app
  const bookId = request.params.bookId

  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    })

    if (book === null) {
      return h
        .response({
          status: "fail",
          message: "Buku tidak ditemukan"
        })
        .code(404)
    }
    
    return h
      .response({
        status: "success",
        data: {
          book: book || undefined
        }
      })
      .code(200)
  } catch (err) {
    console.log(err)
  }
}

async function createBookHandler(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | undefined> {
  const { prisma } = request.server.app
  const payload = request.payload as any

  try {
    if (payload.name === undefined) {
      return h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku"
      }).code(400)
    }

    if (payload.readPage > payload.pageCount) {
      return h.response({
        status: "fail",
        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
      }).code(400)
    }

    const createdBook = await prisma.book.create({
      data: {
        name: payload.name,
        year: payload.year,
        author: payload.author,
        summary: payload.summary,
        publisher: payload.publisher,
        pageCount: payload.pageCount,
        readPage: payload.readPage,
        finished: (payload.pageCount === payload.readPage),
        reading: payload.reading,
      },
    })

    return h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: createdBook.id
        }
      })
      .code(201)
  } catch (err) {
    console.log(err)

    return h
      .response({
        status: "error",
        message: "Buku gagal ditambahkan"
      })
      .code(500)
  }
}

async function updateBookHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app
  const payload = request.payload as any
  const bookId = request.params.bookId

  try {
    if (payload.name === undefined) {
      return h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku"
      }).code(400)
    }

    if (payload.readPage > payload.pageCount) {
      return h.response({
        status: "fail",
        message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
      }).code(400)
    }

    await prisma.book.update({
      where: { id: bookId },
      data: {
        name: payload.name,
        year: payload.year,
        author: payload.author,
        summary: payload.summary,
        publisher: payload.publisher,
        pageCount: payload.pageCount,
        readPage: payload.readPage,
        reading: payload.reading,
        finished: (payload.pageCount === payload.readPage),
      },
    })

    return h
      .response({
        status: "success",
        message: "Buku berhasil diperbarui"
      })
      .code(200)
  } catch (err) {
    console.log(err)

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // ref: https://www.prisma.io/docs/reference/api-reference/error-reference?query=error&page=1
      if (err.code === "P2025") {
        return h
          .response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
          })
          .code(404)
      }
    }

    return h
      .response({
        status: "error",
        message: "Buku gagal diperbarui"
      })
      .code(500)
  }
}

async function deleteBookHandler(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | undefined> {
  const { prisma } = request.server.app
  const bookId = request.params.bookId

  try {


    const book = await prisma.book.delete({
      where: { id: bookId },
    })

    if (book === undefined) {
      return h.response({
          status: "fail",
          message: "Buku gagal dihapus. Id tidak ditemukan"
      }).code(404)
    }

    return h
      .response({
        status: "success",
        message: "Buku berhasil dihapus"
      })
      .code(200)
  } catch (err) {
    console.log(err)

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // ref: https://www.prisma.io/docs/reference/api-reference/error-reference?query=error&page=1
      if (err.code === "P2025") {
        return h
          .response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan"
          })
          .code(404)
      }
    }

    return h
      .response({
        status: "error",
        message: "Buku gagal dihapus"
      })
      .code(500)
  }
}
