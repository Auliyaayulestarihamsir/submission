const Hapi = require('@hapi/hapi');
const { nanoid } = require('nanoid');

const books = [];

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 9000,
    host: process.env.HOST || 'localhost',
  });

  server.route({
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      const { payload } = request;

      try {
        const book = payload;

        if (!book.name || book.pageCount === undefined || book.readPage === undefined) {
          return h.response({
            status: 'fail',
            message: 'Data buku tidak lengkap',
          }).code(400);
        }

        const saveBook = () => {
          const id = nanoid();
          const finished = book.pageCount === book.readPage;
          const insertedAt = new Date().toISOString();
          const updatedAt = insertedAt;

          const newBook = {
            id,
            finished,
            insertedAt,
            updatedAt,
            ...book,
          };

          books.push(newBook);

          return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
              bookId: id,
            },
          }).code(201);
        };

        return saveBook();
      } catch (error) {
        return h.response({
          status: 'fail',
          message: 'Format JSON tidak sesuai atau ada kesalahan lain.',
        }).code(400);
      }
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

init();
