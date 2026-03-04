import { Router } from "express";
import { getCountries, getRegions } from "../controllers/region.controller";

const route = Router();

route.get('/', getRegions)
route.get('/countries', getCountries)

export default route