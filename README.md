##Clustal Visualization

Visualizes the results from ClustalW for protein alignment in a easy to understand dot scatterplot with the ability to use the sliders or inputs to visualize certain sections. The data is segregated into 4 categories:  
* -1 = space *(when amino acids are different and there is no conservation of function)*  
* 0 = * _(when amino acids are identical)_  
* 1 = . _(when amino acids are different but the function is semi-conserved)_  
* 2 = : _(when amino acids are different but the function is conserved)_  
In addition, each dot shows the bases and conservation when hovering over them. 

The input data is structured like the following:  
POS | CON | seq1 | seq2
--- | --- | --- | ---
1 | 0 | N | N

The things that need to be changed in the app.js is the input csv file, the tooltip depending on number of fasta files, and the variables used for those fasta files.

The sample dataset loaded shows the clustal results of IRS1 between mus musculus and human. In addition, this scatterplot is based on the example from Michele Weigle.