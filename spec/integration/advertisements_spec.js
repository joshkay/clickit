const request = require('request');
const sever = require('../../src/server');

const sequelize = require('../../src/db/models/index').sequelize;
const Advertisement = require('../../src/db/models').Advertisement;

const base = 'http://localhost:3000/advertisements/';

describe('routes : advertisements', () => 
{
  beforeEach((done) =>
  {
    this.advertisement;

    sequelize.sync({force: true})
    .then((res) =>
    {
      Advertisement.create({
        title: 'Bloc',
        description: 'Learn to code and become a web developer.'
      })
      .then((advertisement) =>
      {
        this.advertisement = advertisement;
        done();
      })
      .catch((err) =>
      {
        console.log(err);
        done();
      });
    });
  });

  describe('GET /advertisements', () =>
  {
    it ('should return a status code 200 and all advertisements', (done) =>
    {
      request.get(base, (err, res, body) =>
      {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain('Advertisements');
        expect(body).toContain('Bloc');
        done();
      });
    });
  });

  describe('GET /advertisements/new', () =>
  {
    it ('should render a new advertisement form', (done) =>
    {
      request.get(`${base}new`, (err, res, body) =>
      {
        expect(err).toBeNull();
        expect(body).toContain('New Advertisement');
        done();
      });
    });
  });

  describe('POST /advertisements/create', () =>
  {
    const options =
    {
      url: `${base}create`,
      form:
      {
        title: 'Metallica',
        description: "Ride the Lightning"
      }
    };

    it ('should create a new advertisement and redirect', (done) =>
    {
      request.post(options, (err, res, body) =>
      {
        // get id from body response
        let id = parseInt(body.split('/').pop());
        expect(id).not.toBeNaN();
        
        Advertisement.findOne({where: {id: id}})
        .then((advertisement) =>
        {
          expect(res.statusCode).toBe(303);
          expect(advertisement.id).toBe(id);
          expect(advertisement.title).toBe('Metallica');
          expect(advertisement.description).toBe("Ride the Lightning");
          done();
        })
        .catch((err) =>
        {
          console.log(err);
          done();
        });
      });
    });
  });

  describe('GET /advertisements/:id', () =>
  {
    it ('should render a view with the selected advertisement', (done) =>
    {
      request.get(`${base}${this.advertisement.id}`, (err, res, body) =>
      {
        expect(err).toBeNull();
        expect(body).toContain('Bloc');
        done();
      });
    });
  });

  describe('POST /advertisements/:id/destroy', () =>
  {
    it ('should delete the advertisement with the associated ID', (done) =>
    {
      Advertisement.findAll()
      .then((advertisements) =>
      {
        const advertisementCountBeforeDelete = advertisements.length;
        expect(advertisementCountBeforeDelete).toBe(1);

        request.post(`${base}${this.advertisement.id}/destroy`, (err, res, body) =>
        {
          Advertisement.findAll()
          .then((advertisements) =>
          {
            expect(err).toBeNull();
            expect(advertisements.length).toBe(advertisementCountBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });

  describe('GET /advertisements/:id/edit', () =>
  {
    it ('should render a view with an edit advertisement form', (done) =>
    {
      request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) =>
      {
        expect(err).toBeNull();
        expect(body).toContain('Edit Advertisement');
        expect(body).toContain('Bloc');
        done();
      });
    });
  });

  describe('POST /advertisements/:id/update', () =>
  {
    it ('should update the advertisement with the given values', (done) =>
    {
      const options =
      {
        url: `${base}${this.advertisement.id}/update`,
        form:
        {
          title: 'Bloc.io',
          description: 'Learn to code and become a web developer.'
        }
      };

      request.post(options, (err, res, body) =>
      {
        expect(err).toBeNull();
        
        Advertisement.findOne({
          where: {id: this.advertisement.id}
        })
        .then((advertisement) =>
        {
          expect(advertisement.title).toBe('Bloc.io');
          done();
        });
      });
    });
  });
});