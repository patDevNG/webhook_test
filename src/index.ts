import app from './app';

const port = process.env.PORT || 7878;

app.listen(port || 7878, () => {
    console.log(`app listening on ports ${port}`);
});