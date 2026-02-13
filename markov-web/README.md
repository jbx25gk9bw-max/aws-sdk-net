# Markov Text Generator

A browser-based implementation of first-order Markov chain text generation, following the methodology Claude Shannon introduced in his foundational work on information theory.

## Historical Context

The theoretical foundations of this tool trace to classified wartime research. In September 1945, Claude Shannon completed a Bell Labs internal memorandum titled "A Mathematical Theory of Cryptography" (MM 45-110-02), written during his wartime cryptanalysis work. This document remained classified until a shortened version appeared in 1949 as "Communication Theory of Secrecy Systems."

Shannon later noted that his insights into communication theory and cryptography "developed simultaneously" and "were so close together you couldn't separate them." A footnote in the 1945 classified report announced his intention to develop the information-theoretic results in a forthcoming memorandum - this became the 1948 paper "A Mathematical Theory of Communication."

In that 1948 paper, Shannon demonstrated that natural language could be approximated through stochastic processes of increasing order. His approach began with zero-order approximations (letters drawn independently from their frequency distribution) and proceeded through first-order (letter transitions), second-order, and higher approximations.

Shannon's key insight was that the statistical structure of language - the conditional dependencies between successive symbols - could be captured through transition probabilities. A first-order word model, as implemented here, treats each word as depending only on its immediate predecessor, forming a Markov chain where:

$$P(w_n | w_1, w_2, \ldots, w_{n-1}) \approx P(w_n | w_{n-1})$$

This memoryless property, while a crude approximation of actual linguistic structure, produces text that exhibits local coherence while lacking global semantic consistency - a useful pedagogical illustration of what statistical patterns alone can and cannot capture.

## Implementation

This tool constructs a first-order Markov model from user-supplied URLs:

1. **Text extraction**: A serverless function fetches each URL and strips HTML markup
2. **Tokenization**: Text is normalized to lowercase and split on whitespace
3. **Transition counting**: For each word $w_i$, we record all observed successors $w_{i+1}$
4. **Degree filtering**: Only words with two or more distinct successors are retained in the generative vocabulary

The degree-filtering step ensures that every word in the model has branching possibilities, preventing deterministic loops in generation. This reduces vocabulary size substantially but preserves generative variety.

## Relevance to Contemporary AI Discourse

Shannon's demonstration remains instructive for understanding modern language models. Contemporary large language models (LLMs) extend this same principle - learning conditional distributions over tokens given context - but with vastly larger context windows, more parameters, and training corpora measured in trillions of tokens rather than Shannon's hand-tabulated bigram frequencies.

The continuity is methodological: both approaches treat language as a stochastic process to be modeled through observed transition statistics. The discontinuity is scale. Whether the qualitative differences in output between a first-order Markov model and a transformer-based LLM reflect something beyond quantitative scaling remains a subject of ongoing debate.

This tool provides a hands-on demonstration of the simpler end of this spectrum.

## Usage

1. Enter one or more URLs containing text
2. Click "Load URLs" to fetch and build the model
3. Adjust word count and optional starting word
4. Click "Generate" or "Regenerate" for new samples

## References

Shannon, C. E. (1945). A Mathematical Theory of Cryptography. Bell Telephone Laboratories Memorandum MM 45-110-02. [Classified; declassified version published 1949. Digital scan available via [IACR Cryptology Museum](https://www.iacr.org/museum/shannon45.html).]

Shannon, C. E. (1948). A Mathematical Theory of Communication. *Bell System Technical Journal*, 27(3), 379-423.

Shannon, C. E. (1949). Communication Theory of Secrecy Systems. *Bell System Technical Journal*, 28(4), 656-715.

Shannon, C. E. (1951). Prediction and Entropy of Printed English. *Bell System Technical Journal*, 30(1), 50-64.

## License

Public domain.
