FROM ollama/ollama:0.6.5

RUN echo '#!/bin/sh\n\
ollama serve &\n\
sleep 5\n\
ollama pull llama3:8b\n\
wait' > /start.sh && chmod +x /start.sh

ENTRYPOINT ["/start.sh"]
