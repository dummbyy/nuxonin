class NuxoninError extends Error {
  public constructor(...params: string[]) {
    super();
    this.message = params.join(" ");
    this.name = "NUXONIN";
  }
}
