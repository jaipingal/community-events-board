import * as eventService from '../services/event.service.js';

export const getEvents = async (req, res) => {
  res.json(await eventService.listEvents(res.locals.query));
};

export const getCities = async (req, res) => {
  res.json({ cities: await eventService.listCities() });
};

export const getEvent = async (req, res) => {
  const event = await eventService.getActiveEvent(res.locals.params.id);
  res.json({ event });
};

export const getAllEvents = async (req, res) => {
  res.json(await eventService.listAllEvents(res.locals.query));
};

export const createEvent = async (req, res) => {
  const event = await eventService.createEvent(req.body);
  res.status(201).json({ event });
};

export const updateEventStatus = async (req, res) => {
  const event = await eventService.setEventStatus(
    res.locals.params.id,
    req.body.isActive,
  );
  res.json({ event });
};
