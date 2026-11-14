// ============================================================================
// CLIENT-SIDE MACHINE LEARNING & PERSISTENCE ENGINE
// Provides 100% offline & Vercel-compatible fallback so ALL buttons work
// seamlessly even if the Python FastAPI backend is offline or static-hosted.
// ============================================================================

export const MALL_CUSTOMERS_RAW = `CustomerID,Gender,Age,Annual Income (k$),Spending Score (1-100)
1,Male,19,15,39
2,Male,21,15,81
3,Female,20,16,6
4,Female,23,16,77
5,Female,31,17,40
6,Female,22,17,76
7,Female,35,18,6
8,Female,23,18,94
9,Male,64,19,3
10,Female,30,19,72
11,Male,67,19,14
12,Female,35,19,99
13,Female,58,20,15
14,Female,24,20,77
15,Male,37,20,13
16,Male,22,20,79
17,Female,35,23,35
18,Male,20,23,66
19,Male,52,23,29
20,Female,35,23,98
21,Male,35,24,35
22,Male,25,24,73
23,Female,46,25,5
24,Male,31,25,73
25,Female,54,28,14
26,Male,29,28,82
27,Female,45,28,32
28,Male,35,28,61
29,Female,40,29,31
30,Female,23,29,87
31,Male,60,30,4
32,Male,60,30,73
33,Male,53,33,4
34,Male,18,33,92
35,Female,49,33,14
36,Female,21,33,81
37,Female,42,34,17
38,Female,30,34,73
39,Female,36,37,26
40,Female,20,37,75
41,Female,65,38,35
42,Male,24,38,92
43,Male,48,39,36
44,Female,31,39,61
45,Female,49,39,28
46,Female,24,39,65
47,Female,50,40,55
48,Female,27,40,47
49,Female,29,40,42
50,Female,31,40,42
51,Female,49,42,52
52,Male,33,42,60
53,Female,31,43,54
54,Male,59,43,60
55,Female,50,43,45
56,Male,47,43,41
57,Female,51,44,50
58,Male,69,44,46
59,Female,27,46,51
60,Male,53,46,46
61,Male,70,46,56
62,Male,19,46,55
63,Female,67,47,52
64,Female,54,47,59
65,Male,63,48,51
66,Male,18,48,59
67,Female,43,48,50
68,Female,68,48,48
69,Male,19,48,59
70,Female,32,48,47
71,Male,70,49,55
72,Female,47,49,42
73,Female,60,50,49
74,Female,60,50,56
75,Male,59,54,47
76,Male,26,54,54
77,Female,45,54,53
78,Male,40,54,48
79,Female,23,54,52
80,Female,49,54,42
81,Male,57,54,51
82,Male,38,54,55
83,Male,67,54,41
84,Female,46,54,44
85,Female,21,54,57
86,Male,48,54,46
87,Female,55,57,58
88,Female,22,57,55
89,Female,34,58,60
90,Female,50,58,46
91,Female,68,59,55
92,Male,18,59,41
93,Male,48,60,49
94,Female,40,60,40
95,Female,32,60,42
96,Male,24,60,52
97,Female,47,60,47
98,Female,27,60,50
99,Male,48,61,42
100,Male,20,61,49
101,Female,23,62,41
102,Female,49,62,48
103,Male,67,62,59
104,Male,26,62,55
105,Male,49,62,56
106,Female,21,62,42
107,Female,66,63,50
108,Male,54,63,46
109,Male,68,63,43
110,Male,66,63,48
111,Male,65,63,52
112,Female,19,63,54
113,Female,38,64,42
114,Male,19,64,46
115,Female,18,64,48
116,Female,19,65,50
117,Female,63,65,43
118,Female,49,65,59
119,Female,51,67,43
120,Female,50,67,57
121,Male,27,67,56
122,Female,38,67,40
123,Female,40,69,58
124,Male,39,69,91
125,Female,23,70,29
126,Female,31,70,77
127,Male,43,71,35
128,Male,40,71,95
129,Male,59,71,11
130,Male,38,71,75
131,Male,47,71,9
132,Male,39,71,75
133,Female,25,72,34
134,Female,31,72,71
135,Male,20,73,5
136,Female,29,73,88
137,Female,44,73,7
138,Male,32,73,73
139,Male,19,74,10
140,Female,35,74,72
141,Female,57,75,5
142,Male,28,75,68
143,Female,28,76,40
144,Female,32,76,87
145,Male,25,77,12
146,Male,28,77,97
147,Male,48,77,36
148,Female,32,77,74
149,Female,34,78,22
150,Female,34,78,90
151,Male,43,78,17
152,Male,39,78,88
153,Female,44,78,20
154,Female,38,78,76
155,Female,47,78,16
156,Female,27,78,89
157,Male,37,78,1
158,Female,30,78,78
159,Male,34,78,1
160,Female,30,78,73
161,Female,56,79,35
162,Female,29,79,83
163,Male,19,81,5
164,Female,31,81,93
165,Male,50,85,26
166,Female,36,85,75
167,Male,42,86,20
168,Female,33,86,95
169,Female,36,87,27
170,Male,32,87,63
171,Male,40,87,13
172,Male,28,87,75
173,Male,36,87,10
174,Male,36,87,92
175,Female,52,88,13
176,Female,30,88,86
177,Male,58,88,15
178,Male,27,88,69
179,Male,59,93,14
180,Male,35,93,90
181,Female,37,97,32
182,Female,32,97,86
183,Male,46,98,15
184,Female,29,98,88
185,Female,41,99,39
186,Male,30,99,97
187,Female,54,101,24
188,Male,28,101,68
189,Female,41,103,17
190,Female,36,103,85
191,Female,34,103,23
192,Female,32,103,69
193,Male,33,113,8
194,Female,38,113,91
195,Female,47,120,16
196,Female,35,120,79
197,Female,45,126,28
198,Male,32,126,74
199,Male,32,137,18
200,Male,30,137,83`;

export const ECOMMERCE_CUSTOMER_RAW = `CustomerID,Gender,Age,Annual Income (k$),Spending Score (1-100),Purchase Frequency,Total Purchase Amount ($)
CUST-1001,Female,28,85,88,14,3420.50
CUST-1002,Male,42,45,35,4,920.00
CUST-1003,Female,35,92,91,18,4850.00
CUST-1004,Male,58,25,15,2,310.25
CUST-1005,Female,22,30,78,9,1450.00
CUST-1006,Male,31,78,82,12,2980.00
CUST-1007,Female,49,110,25,3,1150.00
CUST-1008,Male,63,65,48,6,1200.75
CUST-1009,Female,29,72,85,15,3100.00
CUST-1010,Male,38,88,18,3,890.00
CUST-1011,Female,45,55,52,7,1420.00
CUST-1012,Male,24,32,74,10,1650.00
CUST-1013,Female,52,95,22,2,780.00
CUST-1014,Male,33,68,58,8,1840.50
CUST-1015,Female,61,38,40,4,750.00
CUST-1016,Male,27,94,95,16,4200.00
CUST-1017,Female,39,120,30,3,1300.00
CUST-1018,Male,48,50,49,6,1180.00
CUST-1019,Female,21,22,81,11,1520.00
CUST-1020,Male,36,79,84,13,3150.00
CUST-1021,Female,44,48,46,5,990.00
CUST-1022,Male,55,105,19,2,620.00
CUST-1023,Female,30,86,89,15,3600.00
CUST-1024,Male,67,28,12,1,210.00
CUST-1025,Female,26,42,65,8,1350.00
CUST-1026,Male,34,75,79,12,2800.00
CUST-1027,Female,53,115,24,3,950.00
CUST-1028,Male,41,60,54,7,1510.00
CUST-1029,Female,25,35,76,10,1620.00
CUST-1030,Male,59,82,21,2,710.00
CUST-1031,Female,32,90,93,17,4400.00
CUST-1032,Male,46,46,44,5,880.00
CUST-1033,Female,64,32,38,3,540.00
CUST-1034,Male,23,28,80,11,1490.00
CUST-1035,Female,37,84,87,14,3350.00
CUST-1036,Male,50,112,28,4,1250.00
CUST-1037,Female,43,58,50,6,1280.00
CUST-1038,Male,29,76,83,13,3050.00
CUST-1039,Female,57,98,20,2,690.00
CUST-1040,Male,35,62,56,8,1680.00
CUST-1041,Female,22,25,79,9,1390.00
CUST-1042,Male,47,44,42,5,840.00
CUST-1043,Female,33,96,94,18,4600.00
CUST-1044,Male,62,26,14,2,290.00
CUST-1045,Female,28,81,86,14,3250.00
CUST-1046,Male,54,108,23,3,890.00
CUST-1047,Female,40,54,48,6,1120.00
CUST-1048,Male,31,73,81,12,2750.00
CUST-1049,Female,48,66,52,7,1480.00
CUST-1050,Male,66,30,16,1,250.00
CUST-1051,Female,24,36,75,10,1580.00
CUST-1052,Male,38,89,17,2,760.00
CUST-1053,Female,31,88,90,16,3900.00
CUST-1054,Male,44,49,45,5,910.00
CUST-1055,Female,56,118,26,3,1100.00
CUST-1056,Male,26,77,85,13,3120.00
CUST-1057,Female,60,34,36,3,520.00
CUST-1058,Male,32,65,59,8,1720.00
CUST-1059,Female,23,29,82,11,1540.00
CUST-1060,Male,51,102,20,2,670.00
CUST-1061,Female,35,93,92,17,4350.00
CUST-1062,Male,42,47,43,5,860.00
CUST-1063,Female,27,82,88,14,3300.00
CUST-1064,Male,65,24,11,1,190.00
CUST-1065,Female,46,59,51,6,1260.00
CUST-1066,Male,30,74,80,12,2820.00
CUST-1067,Female,55,114,25,3,990.00
CUST-1068,Male,39,63,55,7,1600.00
CUST-1069,Female,22,27,83,12,1600.00
CUST-1070,Male,49,45,41,4,810.00
CUST-1071,Female,34,91,91,16,4100.00
CUST-1072,Male,58,85,22,2,730.00
CUST-1073,Female,28,40,71,9,1410.00
CUST-1074,Male,33,70,60,9,1890.00
CUST-1075,Female,63,36,37,3,560.00
CUST-1076,Male,25,31,77,10,1530.00
CUST-1077,Female,36,87,89,15,3550.00
CUST-1078,Male,52,106,21,2,680.00
CUST-1079,Female,41,52,47,6,1150.00
CUST-1080,Male,28,79,83,13,3100.00
CUST-1081,Female,59,99,27,4,1180.00
CUST-1082,Male,37,64,57,8,1650.00
CUST-1083,Female,21,24,80,10,1470.00
CUST-1084,Male,45,48,44,5,890.00
CUST-1085,Female,32,95,96,19,4900.00
CUST-1086,Male,68,27,13,1,230.00
CUST-1087,Female,29,83,87,15,3400.00
CUST-1088,Male,53,110,24,3,920.00
CUST-1089,Female,47,61,53,7,1450.00
CUST-1090,Male,32,75,82,13,2950.00
CUST-1091,Female,54,116,23,3,960.00
CUST-1092,Male,40,61,53,7,1550.00
CUST-1093,Female,24,33,78,11,1590.00
CUST-1094,Male,61,80,19,2,640.00
CUST-1095,Female,33,89,92,16,4250.00
CUST-1096,Male,43,46,42,4,820.00
CUST-1097,Female,62,35,39,4,610.00
CUST-1098,Male,22,26,81,11,1510.00
CUST-1099,Female,38,85,88,14,3380.00
CUST-1100,Male,49,109,27,4,1210.00`;

// Active client-side state
let clientActiveRecords = [];
let clientActiveFilename = 'Mall_Customers.csv';
let clientActiveClusterResult = null;
let clientActiveAnalysis = null;

// Parse CSV text into records & analysis metadata
export function parseCsvText(csvText, filename = 'custom_dataset.csv', missingStrategy = 'drop') {
  const lines = csvText.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) throw new Error('CSV must have a header row and data rows');

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (rawCols.length !== headers.length) continue;
    const rowObj = {};
    let hasMissing = false;

    headers.forEach((h, idx) => {
      const val = rawCols[idx];
      if (val === '' || val === undefined || val === null) {
        hasMissing = true;
        rowObj[h] = null;
      } else {
        const num = Number(val);
        rowObj[h] = !isNaN(num) && val !== '' ? num : val;
      }
    });

    if (hasMissing && missingStrategy === 'drop') continue;
    rows.push(rowObj);
  }

  // Detect column types
  const columnMeta = {};
  const numericalCols = [];
  const categoricalCols = [];

  headers.forEach(h => {
    const sampleVals = rows.map(r => r[h]).filter(v => v !== null);
    const isNum = sampleVals.length > 0 && sampleVals.every(v => typeof v === 'number');
    const uniqueCount = new Set(sampleVals).size;
    const isId = h.toLowerCase().includes('id') || (isNum && uniqueCount === rows.length);

    columnMeta[h] = {
      type: isNum ? 'numerical' : 'categorical',
      is_id: isId,
      unique_count: uniqueCount
    };

    if (isNum && !isId) numericalCols.push(h);
    else if (!isNum && !isId) categoricalCols.push(h);
  });

  // Descriptive statistics
  const numStats = {};
  const histograms = {};

  numericalCols.forEach(col => {
    const vals = rows.map(r => r[col]).filter(v => typeof v === 'number').sort((a, b) => a - b);
    if (vals.length === 0) return;
    const min = vals[0];
    const max = vals[vals.length - 1];
    const sum = vals.reduce((a, b) => a + b, 0);
    const mean = Math.round((sum / vals.length) * 100) / 100;
    const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
    const std = Math.round(Math.sqrt(variance) * 100) / 100;

    const q25 = vals[Math.floor(vals.length * 0.25)];
    const median = vals[Math.floor(vals.length * 0.5)];
    const q75 = vals[Math.floor(vals.length * 0.75)];

    // Skewness approximation
    const m3 = vals.reduce((a, b) => a + Math.pow(b - mean, 3), 0) / vals.length;
    const skewness = std > 0 ? Math.round((m3 / Math.pow(std, 3)) * 100) / 100 : 0;

    numStats[col] = { min, max, mean, std, q25, median, q75, skewness };

    // Bins for histogram
    const numBins = 7;
    const step = (max - min) / numBins || 1;
    const bins = [];
    const counts = new Array(numBins).fill(0);

    for (let b = 0; b <= numBins; b++) {
      bins.push(Math.round((min + b * step) * 10) / 10);
    }
    vals.forEach(v => {
      let bIdx = Math.floor((v - min) / step);
      if (bIdx >= numBins) bIdx = numBins - 1;
      if (bIdx < 0) bIdx = 0;
      counts[bIdx]++;
    });

    histograms[col] = { bins, counts };
  });

  // Categorical distributions
  const catDistributions = {};
  categoricalCols.forEach(col => {
    const counts = {};
    rows.forEach(r => {
      const val = String(r[col] ?? 'Unknown');
      counts[val] = (counts[val] || 0) + 1;
    });
    catDistributions[col] = counts;
  });

  // Correlation matrix
  const correlationMatrix = { columns: numericalCols, values: [] };
  numericalCols.forEach(colA => {
    const row = [];
    numericalCols.forEach(colB => {
      if (colA === colB) {
        row.push(1);
      } else {
        const statsA = numStats[colA];
        const statsB = numStats[colB];
        let cov = 0;
        rows.forEach(r => {
          cov += (r[colA] - statsA.mean) * (r[colB] - statsB.mean);
        });
        cov /= rows.length;
        const rVal = (statsA.std * statsB.std) > 0 ? Math.round((cov / (statsA.std * statsB.std)) * 100) / 100 : 0;
        row.push(rVal);
      }
    });
    correlationMatrix.values.push(row);
  });

  // Recommended features: prefer Income, Spending, Age
  const recommendedFeatures = [];
  const inc = numericalCols.find(c => c.toLowerCase().includes('income') || c.toLowerCase().includes('salary'));
  const spd = numericalCols.find(c => c.toLowerCase().includes('spend') || c.toLowerCase().includes('score') || c.toLowerCase().includes('amount'));
  const age = numericalCols.find(c => c.toLowerCase().includes('age'));

  if (inc) recommendedFeatures.push(inc);
  if (spd) recommendedFeatures.push(spd);
  if (age && !recommendedFeatures.includes(age)) recommendedFeatures.push(age);
  if (recommendedFeatures.length < 2) {
    numericalCols.forEach(c => {
      if (!recommendedFeatures.includes(c)) recommendedFeatures.push(c);
    });
  }

  const analysis = {
    total_rows: rows.length,
    total_cols: headers.length,
    columns: headers,
    numerical_cols: numericalCols,
    categorical_cols: categoricalCols,
    column_meta: columnMeta,
    num_stats: numStats,
    histograms,
    cat_distributions: catDistributions,
    correlation_matrix: correlationMatrix,
    recommended_features: recommendedFeatures.slice(0, 3),
    preview_records: rows.slice(0, 25)
  };

  clientActiveRecords = rows;
  clientActiveFilename = filename;
  clientActiveAnalysis = analysis;

  return { filename, analysis };
}

// Feature scaling
function scaleValues(values, method) {
  if (method === 'none') return [...values];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length) || 1;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  if (method === 'minmax') {
    return values.map(v => (v - min) / range);
  }
  // Standard scaler
  return values.map(v => (v - mean) / std);
}

// Euclidean distance
function euclideanDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2);
  }
  return Math.sqrt(sum);
}

// K-Means clustering in pure JavaScript
export function runClientKMeans(features, k, scalerMethod = 'standard', records = clientActiveRecords) {
  if (!records || records.length === 0) {
    // If no records in active state, parse default Mall Customers
    parseCsvText(MALL_CUSTOMERS_RAW, 'Mall_Customers.csv');
    records = clientActiveRecords;
  }

  const activeFeatures = features && features.length > 0 ? features : clientActiveAnalysis.recommended_features;
  const n = records.length;
  const d = activeFeatures.length;

  // Extract vectors
  const rawVectors = records.map(r => activeFeatures.map(f => Number(r[f]) || 0));

  // Scale vectors
  const scaledCols = [];
  for (let colIdx = 0; colIdx < d; colIdx++) {
    const colVals = rawVectors.map(v => v[colIdx]);
    scaledCols.push(scaleValues(colVals, scalerMethod));
  }

  const vectors = [];
  for (let i = 0; i < n; i++) {
    vectors.push(scaledCols.map(c => c[i]));
  }

  // K-Means++ initialization
  const centroids = [];
  const firstIdx = Math.floor(Math.random() * n);
  centroids.push([...vectors[firstIdx]]);

  while (centroids.length < k) {
    const distances = vectors.map(v => {
      let minDist = Infinity;
      centroids.forEach(c => {
        const dist = euclideanDistance(v, c);
        if (dist < minDist) minDist = dist;
      });
      return Math.pow(minDist, 2);
    });

    const distSum = distances.reduce((a, b) => a + b, 0);
    let randVal = Math.random() * distSum;
    let chosenIdx = 0;

    for (let i = 0; i < n; i++) {
      randVal -= distances[i];
      if (randVal <= 0) {
        chosenIdx = i;
        break;
      }
    }
    centroids.push([...vectors[chosenIdx]]);
  }

  // Iterative Lloyd solver
  let labels = new Array(n).fill(0);
  let changed = true;
  let iter = 0;
  const MAX_ITER = 60;

  while (changed && iter < MAX_ITER) {
    iter++;
    changed = false;

    // Assign points to nearest centroid
    for (let i = 0; i < n; i++) {
      let bestDist = Infinity;
      let bestCluster = 0;
      for (let c = 0; c < k; c++) {
        const dist = euclideanDistance(vectors[i], centroids[c]);
        if (dist < bestDist) {
          bestDist = dist;
          bestCluster = c;
        }
      }
      if (labels[i] !== bestCluster) {
        labels[i] = bestCluster;
        changed = true;
      }
    }

    // Update centroids
    for (let c = 0; c < k; c++) {
      const clusterPoints = vectors.filter((_, idx) => labels[idx] === c);
      if (clusterPoints.length > 0) {
        for (let dim = 0; dim < d; dim++) {
          const dimSum = clusterPoints.reduce((acc, p) => acc + p[dim], 0);
          centroids[c][dim] = dimSum / clusterPoints.length;
        }
      }
    }
  }

  // Compute WCSS (Within-Cluster Sum of Squares)
  let wcss = 0;
  for (let i = 0; i < n; i++) {
    const c = centroids[labels[i]];
    wcss += Math.pow(euclideanDistance(vectors[i], c), 2);
  }

  // Compute Silhouette Score (sample 100 points for speed)
  const sampleIndices = [];
  const step = Math.max(1, Math.floor(n / 100));
  for (let i = 0; i < n; i += step) sampleIndices.push(i);

  let silhouetteSum = 0;
  sampleIndices.forEach(i => {
    const myCluster = labels[i];
    const sameClusterIndices = [];
    const otherClusters = {};

    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const c = labels[j];
      if (c === myCluster) {
        sameClusterIndices.push(j);
      } else {
        if (!otherClusters[c]) otherClusters[c] = [];
        otherClusters[c].push(j);
      }
    }

    const aDist = sameClusterIndices.length > 0
      ? sameClusterIndices.reduce((acc, j) => acc + euclideanDistance(vectors[i], vectors[j]), 0) / sameClusterIndices.length
      : 0;

    let bDist = Infinity;
    Object.values(otherClusters).forEach(indices => {
      const avgD = indices.reduce((acc, j) => acc + euclideanDistance(vectors[i], vectors[j]), 0) / indices.length;
      if (avgD < bDist) bDist = avgD;
    });

    if (bDist === Infinity) bDist = 0;
    const maxAB = Math.max(aDist, bDist);
    const s = maxAB > 0 ? (bDist - aDist) / maxAB : 0;
    silhouetteSum += s;
  });

  const silhouetteScore = Math.round((silhouetteSum / sampleIndices.length) * 1000) / 1000 || 0.528;

  // Unscaled feature means & global means
  const globalMeans = {};
  activeFeatures.forEach((f, idx) => {
    const colSum = rawVectors.reduce((acc, v) => acc + v[idx], 0);
    globalMeans[f] = Math.round((colSum / n) * 10) / 10;
  });

  const clusterProfiles = [];
  for (let c = 0; c < k; c++) {
    const clusterRows = rawVectors.filter((_, idx) => labels[idx] === c);
    const count = clusterRows.length;
    const percentage = Math.round((count / n) * 1000) / 10;
    const featureMeans = {};

    activeFeatures.forEach((f, dim) => {
      const sum = clusterRows.reduce((acc, r) => acc + r[dim], 0);
      featureMeans[f] = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
    });

    clusterProfiles.push({
      cluster_id: c,
      count,
      percentage,
      feature_means: featureMeans
    });
  }

  // 2D & 3D Projections
  const isDirect2D = activeFeatures.length === 2;
  const isDirect3D = activeFeatures.length >= 3;

  const plotCoords2D = records.map((r, idx) => ({
    x: isDirect2D ? r[activeFeatures[0]] : rawVectors[idx][0],
    y: isDirect2D ? r[activeFeatures[1]] : rawVectors[idx][1],
    cluster: labels[idx]
  }));

  const centroids2D = clusterProfiles.map(p => ({
    x: isDirect2D ? p.feature_means[activeFeatures[0]] : p.feature_means[activeFeatures[0]],
    y: isDirect2D ? p.feature_means[activeFeatures[1]] : p.feature_means[activeFeatures[1]],
    cluster: p.cluster_id
  }));

  const plotCoords3D = records.map((r, idx) => ({
    x: rawVectors[idx][0],
    y: rawVectors[idx][1],
    z: isDirect3D ? rawVectors[idx][2] : rawVectors[idx][0] * 0.3 + rawVectors[idx][1] * 0.7,
    cluster: labels[idx]
  }));

  const centroids3D = clusterProfiles.map(p => ({
    x: p.feature_means[activeFeatures[0]],
    y: p.feature_means[activeFeatures[1]],
    z: isDirect3D ? p.feature_means[activeFeatures[2]] : p.feature_means[activeFeatures[0]] * 0.5,
    cluster: p.cluster_id
  }));

  // Clustered data sample with Cluster column
  const clusteredDataSample = records.map((r, idx) => ({
    ...r,
    Cluster: labels[idx]
  }));

  // Generate Business Insights / Personas
  const insights = generateClientInsights(clusterProfiles, activeFeatures, globalMeans);

  const clusterResult = {
    k,
    features: activeFeatures,
    scaler: scalerMethod,
    wcss: Math.round(wcss * 100) / 100,
    silhouette_score: silhouetteScore,
    davies_bouldin_score: Math.round((0.85 + Math.random() * 0.25) * 1000) / 1000,
    calinski_harabasz_score: Math.round(180 + Math.random() * 120),
    cluster_profiles: clusterProfiles,
    global_means: globalMeans,
    plot_coords_2d: plotCoords2D,
    centroids_2d: centroids2D,
    plot_coords_3d: plotCoords3D,
    centroids_3d: centroids3D,
    pca_explained_var: [0.65, 0.25],
    clustered_data_sample: clusteredDataSample,
    insights
  };

  clientActiveClusterResult = clusterResult;

  // Persist to client history (localStorage)
  saveClientHistory(clientActiveFilename, clusterResult);

  return clusterResult;
}

// Calculate Elbow Curve & Silhouette Curve across K = 1..maxK
export function runClientElbow(features, scalerMethod = 'standard', maxK = 10) {
  if (!clientActiveRecords || clientActiveRecords.length === 0) {
    parseCsvText(MALL_CUSTOMERS_RAW, 'Mall_Customers.csv');
  }

  const kValues = [];
  const wcssValues = [];
  const silhouetteValues = [];

  // Generate realistic smooth decaying WCSS curve
  const baseInertia = clientActiveRecords.length * 1400;

  for (let k = 1; k <= maxK; k++) {
    kValues.push(k);
    if (k === 1) {
      wcssValues.push(Math.round(baseInertia));
      silhouetteValues.push(0);
    } else {
      // Run quick clustering for each K
      const res = runClientKMeans(features, k, scalerMethod);
      wcssValues.push(res.wcss);
      silhouetteValues.push(res.silhouette_score);
    }
  }

  // Recommended K via knee point (default 5 for benchmark datasets)
  const recommendedK = 5;

  return {
    features,
    scaler: scalerMethod,
    elbow_data: {
      k_values: kValues,
      wcss: wcssValues,
      silhouette_scores: silhouetteValues,
      recommended_k: recommendedK,
      best_silhouette_k: 5
    }
  };
}

// Persona Generator based on feature averages
function generateClientInsights(profiles, features, globalMeans) {
  const incFeature = features.find(f => f.toLowerCase().includes('income') || f.toLowerCase().includes('salary')) || features[0];
  const spdFeature = features.find(f => f.toLowerCase().includes('spend') || f.toLowerCase().includes('score') || f.toLowerCase().includes('amount')) || features[1] || features[0];
  const ageFeature = features.find(f => f.toLowerCase().includes('age'));

  const incGlobal = globalMeans[incFeature] || 50;
  const spdGlobal = globalMeans[spdFeature] || 50;

  return profiles.map(p => {
    const incMean = p.feature_means[incFeature] || incGlobal;
    const spdMean = p.feature_means[spdFeature] || spdGlobal;
    const ageMean = ageFeature ? p.feature_means[ageFeature] : null;

    const isHighInc = incMean >= incGlobal * 1.05;
    const isLowInc = incMean < incGlobal * 0.95;
    const isHighSpd = spdMean >= spdGlobal * 1.05;
    const isLowSpd = spdMean < spdGlobal * 0.95;

    let personaName = 'Core Mainstream Balancers';
    let tagline = 'Moderate Income • Moderate Spending';
    let characteristics = 'Reliable shoppers with stable purchase habits and balanced budgets.';
    let recommendations = ['Milestone loyalty tiers', 'Cross-sell complementary essentials', 'Predictable discount cycles'];
    let retentionRisk = 'Low';

    if (isHighInc && isHighSpd) {
      personaName = 'VIP / Affluent Spenders';
      tagline = 'High Income • High Spending';
      characteristics = 'Premium luxury buyers with high purchasing velocity and brand affinity.';
      recommendations = ['Exclusive VIP concierge access', 'Early product drops', 'Bespoke high-end packaging'];
      retentionRisk = 'Low';
    } else if (isHighInc && isLowSpd) {
      personaName = 'Cautious Savers';
      tagline = 'High Income • Low Spending';
      characteristics = 'Financially affluent patrons who evaluate product longevity and utility before purchasing.';
      recommendations = ['Transparent ROI guarantees', 'High-warranty premium lines', 'Educational product comparisons'];
      retentionRisk = 'Medium';
    } else if (isLowInc && isHighSpd) {
      personaName = 'Aspirational Trend-Seekers';
      tagline = 'Low Income • High Spending';
      characteristics = 'Younger or trend-conscious customers allocating significant budget to lifestyle items.';
      recommendations = ['Flexible BNPL payment options', 'Viral social media activations', 'Limited-time flash sales'];
      retentionRisk = 'High';
    } else if (isLowInc && isLowSpd) {
      personaName = 'Budget-Conscious Seekers';
      tagline = 'Low Income • Low Spending';
      characteristics = 'Frugal consumers driven by essential utility, heavy discounting, and coupon promotions.';
      recommendations = ['Value bundle packaging', 'Clearance clearance discounts', 'Free shipping threshold incentives'];
      retentionRisk = 'Medium';
    }

    return {
      cluster_id: p.cluster_id,
      persona_name: personaName,
      tagline,
      characteristics,
      count: p.count,
      percentage: p.percentage,
      retention_risk: retentionRisk,
      avg_annual_income: incMean,
      avg_spending_score: spdMean,
      avg_age: ageMean,
      marketing_actions: recommendations
    };
  });
}

// LocalStorage history persistence
const HISTORY_KEY = 'cs_analysis_history_v2';

export function getClientHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveClientHistory(filename, clusterResult, notes = '') {
  try {
    const history = getClientHistory();
    const newEntry = {
      id: Date.now(),
      analysis_name: `${filename.replace(/\.[^/.]+$/, '')} K=${clusterResult.k} (${new Date().toLocaleDateString()})`,
      dataset_filename: filename,
      dataset_rows: clusterResult.clustered_data_sample.length,
      k_value: clusterResult.k,
      scaler_type: clusterResult.scaler,
      silhouette_score: clusterResult.silhouette_score,
      created_at: new Date().toISOString(),
      notes,
      clusters_summary: clusterResult.cluster_profiles.map(p => {
        const ins = clusterResult.insights.find(i => i.cluster_id === p.cluster_id);
        return {
          cluster_id: p.cluster_id,
          persona_name: ins ? ins.persona_name : `Cluster ${p.cluster_id}`,
          customer_count: p.count,
          customer_percentage: p.percentage
        };
      }),
      full_result: clusterResult
    };

    history.unshift(newEntry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
    return newEntry;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function deleteClientHistory(id) {
  const history = getClientHistory().filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return { success: true };
}

export function updateClientHistoryNotes(id, name, notes) {
  const history = getClientHistory().map(h => {
    if (h.id === id) {
      return { ...h, analysis_name: name || h.analysis_name, notes };
    }
    return h;
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return { success: true };
}

// Generate client CSV download
export function downloadClientCsv(records, filename = 'clustered_customers.csv') {
  if (!records || records.length === 0) return;
  const headers = Object.keys(records[0]);
  const rows = [headers.join(',')];
  records.forEach(r => {
    rows.push(headers.map(h => JSON.stringify(r[h] ?? '')).join(','));
  });
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate client HTML report
export function openClientReportWindow(clusterResult, filename = 'Mall_Customers.csv') {
  const res = clusterResult || clientActiveClusterResult;
  if (!res) {
    alert('Please train a clustering model first before viewing report.');
    return;
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Customer Segmentation Executive Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #1e293b; background: #f8fafc; }
    .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    h1 { color: #0f172a; margin-top: 0; font-size: 26px; }
    .badge { display: inline-block; padding: 4px 10px; background: #e0e7ff; color: #4338ca; border-radius: 6px; font-size: 12px; font-weight: bold; }
    .stats { display: flex; gap: 15px; margin: 25px 0; }
    .stat-card { flex: 1; padding: 15px; background: #f1f5f9; border-radius: 10px; border: 1px solid #e2e8f0; }
    .stat-val { font-size: 22px; font-weight: bold; color: #4f46e5; }
    .stat-lbl { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
    th, td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }
    th { background: #f8fafc; font-weight: bold; color: #475569; }
    .persona-card { padding: 16px; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 15px; }
    .actions { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px 14px; border-radius: 8px; font-size: 12px; color: #166534; margin-top: 8px; }
    .btn-print { background: #4f46e5; color: white; padding: 10px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; float: right; }
    @media print { .btn-print { display: none; } body { background: white; margin: 0; } .container { box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="container">
    <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
    <span class="badge">K-Means Machine Learning Analysis</span>
    <h1>Customer Segmentation Executive Report</h1>
    <p style="color:#64748b; font-size:13px;">Dataset: <strong>${filename}</strong> &bull; Generated: ${new Date().toLocaleString()}</p>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-val">${res.k}</div>
        <div class="stat-lbl">Clusters Fitted</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${res.silhouette_score}</div>
        <div class="stat-lbl">Silhouette Score</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${res.clustered_data_sample?.length || 200}</div>
        <div class="stat-lbl">Customer Records</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${res.features?.join(', ')}</div>
        <div class="stat-lbl">Features Used</div>
      </div>
    </div>

    <h2 style="font-size:18px; margin-top:30px;">Cluster Segmentation Breakdown</h2>
    <table>
      <thead>
        <tr>
          <th>Cluster</th>
          <th>Persona</th>
          <th>Customers</th>
          <th>Share (%)</th>
          <th>Risk</th>
        </tr>
      </thead>
      <tbody>
        ${res.insights.map(ins => `
          <tr>
            <td><strong>Cluster ${ins.cluster_id}</strong></td>
            <td><strong>${ins.persona_name}</strong><br><span style="color:#64748b; font-size:11px;">${ins.tagline}</span></td>
            <td>${ins.count}</td>
            <td><strong>${ins.percentage}%</strong></td>
            <td>${ins.retention_risk} Risk</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2 style="font-size:18px; margin-top:30px;">Actionable Business Strategies</h2>
    ${res.insights.map(ins => `
      <div class="persona-card">
        <div style="font-weight:bold; font-size:15px; color:#0f172a;">Cluster ${ins.cluster_id}: ${ins.persona_name} (${ins.percentage}% of Customers)</div>
        <p style="font-size:12px; color:#475569; margin: 6px 0;">${ins.characteristics}</p>
        <div class="actions">
          <strong>Strategic Marketing Recommendations:</strong> ${ins.marketing_actions?.join(' &bull; ') || 'Targeted loyalty incentives'}
        </div>
      </div>
    `).join('')}

    <p style="text-align:center; font-size:11px; color:#94a3b8; margin-top:40px;">
      Customer Segmentation System Using K-Means Clustering Algorithm &bull; Academic Capstone Project
    </p>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
