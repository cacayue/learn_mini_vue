let queue = new Array<any>();

let isFlashPending = false;
export function queueJob(job: any) {
  if (!queue.includes(job)) {
    queue.push(job);
  }

  queueFlashJob();
}
function queueFlashJob() {
  if (isFlashPending) {
    return;
  }
  isFlashPending = true;
  Promise.resolve().then(() => {
    isFlashPending = false;
    let job;
    while ((job = queue.shift())) {
      console.log('create job');
      job && job();
    }
  });
}
