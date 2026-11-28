// An error whose message is safe to show to the user.
// Its message is stored in document.errorMessage when processing fails.
export class ProcessingError extends Error {}