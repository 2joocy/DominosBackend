import { environment } from './environment';
import app from './main';

app.listen(environment.port, () => {
	console.log(`Server listening on port ${environment.port}`);
});
