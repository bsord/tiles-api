'use strict';

const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { BatchSpanProcessor } = require("@opentelemetry/tracing");
const { B3Propagator } = require('@opentelemetry/propagator-b3');
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { MongooseInstrumentation } = require('opentelemetry-instrumentation-mongoose');


const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "tiles-api",
  })
});

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
console.log(process.env.TRACING_HOST)
provider.addSpanProcessor(
  new BatchSpanProcessor(
    new ZipkinExporter({
        url: process.env.TRACING_HOST
      // If you are running your tracing backend on another host,
      // you can point to it using the `url` parameter of the
      // exporter config.
    })
  )
);

provider.register({
    propagator: new B3Propagator(),
});

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new MongooseInstrumentation(),
  ],
});

console.log("tracing initialized");