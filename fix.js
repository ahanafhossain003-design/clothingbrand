function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(value => {
      clearTimeout(timer);
      resolve(value);
    }).catch(err => {
      clearTimeout(timer);
      reject(err);
    });
  });
}
