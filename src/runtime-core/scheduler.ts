let queue = new Array<any>();

let isFlashPending = false;

export function nextTick(fn: any) {
  return fn ? Promise.resolve().then(fn) : Promise.resolve();
}

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
  nextTick(flashJob);
}
function flashJob() {
  isFlashPending = false;
  let job;
  while ((job = queue.shift())) {
    console.log('create job');
    job && job();
  }
}
