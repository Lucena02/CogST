FROM ollama/ollama:0.6.5

RUN echo '#!/bin/sh\n\
ollama serve &\n\
sleep 5\n\
ollama pull gemma3\n\
wait' > /start.sh && chmod +x /start.sh

ENTRYPOINT ["/start.sh"]
