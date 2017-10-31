import * as resolve from 'resolve';
import * as yaml from 'js-yaml';
import fs from 'fs';

export default class Resolver {
    constructor(basedir) {
        this.basedir = basedir;
    }

    syntax(path) {
        let res = resolve.sync(path, { basedir: this.basedir });
        let macros = [];

        if (res.includes('.json') || res.includes('.yml') || res.includes('.yaml')) {
            let file = fs.readFileSync(res, { encoding: 'utf8' });
            let file_data = yaml.safeLoad(file, 'utf8');

            macros = file_data;
        }

        return macros;
    }
    file(path) {
        let res = resolve.sync(path, { basedir: this.basedir });

        if (res.includes('.cube') || res.includes('.cb')) {
            let file = fs.readFileSync(res, { encoding: 'utf8' });

            return file;
        }

        return;
    }
}