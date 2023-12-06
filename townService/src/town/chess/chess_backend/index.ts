import app from './server';

async function main() {
  const port = 5757;
  try {
    app.listen(port, () => {
      console.log(`server is running on port: ${port}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main().catch(console.error);
