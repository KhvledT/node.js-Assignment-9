import express from 'express';
import authRouter from './Modules/Auth/auth.controller.js';
import { DB_Connection } from './DB/connection.js';
import { globalErrorHandler } from './Common/Response.js';
import userRouter from './Modules/User/user.controller.js';
import noteRouter from './Modules/Note/note.controller.js';

function bootstrap() {
    const app = express();
    const port = 3000;
    app.use(express.json());
    DB_Connection();
    app.use("/auth" , authRouter);
    app.use("/user" , userRouter);
    app.use("/note" , noteRouter);





    app.use(globalErrorHandler);
    app.listen(port, () => {
        console.log(`server is running on port : ${port}`);
    })
}
export default bootstrap;