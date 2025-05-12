import type {Router} from 'express';
import express from 'express';
const router: Router = express.Router();

router.post('/', (req, res) => {
    console.log(req);
    res.json({message: 'SSL'});
});

router.get('/', (req, res, next) => {
    console.log(req);
    console.log(next);
    res.json({message: 'Hello SSL'});
});

router.post('/ypV5ImsWViGPWlnHMGd5HakgVtnzlI5e0qHVq-xklaA', (req, res) => {
    res.send(
        'ypV5ImsWViGPWlnHMGd5HakgVtnzlI5e0qHVq-xklaA.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.get('/ypV5ImsWViGPWlnHMGd5HakgVtnzlI5e0qHVq-xklaA', (req, res) => {
    res.send(
        'ypV5ImsWViGPWlnHMGd5HakgVtnzlI5e0qHVq-xklaA.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.post('/RWpDmvmNxLHvDVLsiC-DEVpcWk-mg5VbVy6CRmkY8CI', (req, res) => {
    res.send(
        'RWpDmvmNxLHvDVLsiC-DEVpcWk-mg5VbVy6CRmkY8CI.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.get('/RWpDmvmNxLHvDVLsiC-DEVpcWk-mg5VbVy6CRmkY8CI', (req, res) => {
    res.send(
        'RWpDmvmNxLHvDVLsiC-DEVpcWk-mg5VbVy6CRmkY8CI.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.post('/El57BFxIX11yuzB9xg5O8e8EtQm26tDvtdXSlUBkogg', (req, res) => {
    res.send(
        'El57BFxIX11yuzB9xg5O8e8EtQm26tDvtdXSlUBkogg.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.get('/El57BFxIX11yuzB9xg5O8e8EtQm26tDvtdXSlUBkogg', (req, res) => {
    res.send(
        'El57BFxIX11yuzB9xg5O8e8EtQm26tDvtdXSlUBkogg.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.post('/yvv9qs1EEhic_TF8lO-Ey5COrG9WRfk9-s260UhNyjg', (req, res) => {
    res.send(
        'yvv9qs1EEhic_TF8lO-Ey5COrG9WRfk9-s260UhNyjg.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.get('/yvv9qs1EEhic_TF8lO-Ey5COrG9WRfk9-s260UhNyjg', (req, res) => {
    res.send(
        'yvv9qs1EEhic_TF8lO-Ey5COrG9WRfk9-s260UhNyjg.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.post('/eAhSU1WCytGk_YiU25jvextL56HmRGxLDPsBwQe0CWI', (req, res) => {
    res.send(
        'eAhSU1WCytGk_YiU25jvextL56HmRGxLDPsBwQe0CWI._rru0JgAEX1oWwR4SVw9QAtHkFZehQTvFNDzBKzvTbQ',
    );
});

router.get('/eAhSU1WCytGk_YiU25jvextL56HmRGxLDPsBwQe0CWI', (req, res) => {
    res.send(
        'eAhSU1WCytGk_YiU25jvextL56HmRGxLDPsBwQe0CWI._rru0JgAEX1oWwR4SVw9QAtHkFZehQTvFNDzBKzvTbQ',
    );
});

export const well = router;
// export default router;
