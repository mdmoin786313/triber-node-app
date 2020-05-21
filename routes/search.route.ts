import { Express } from 'express';
import searchController from '../controllers/search.controller';

export default class SearchRoute {
    searchUser(app: Express) {
        app.post('/v1/search', searchController.searchUser);
    }

    search(app:Express) {
        this.searchUser(app);
    }
}