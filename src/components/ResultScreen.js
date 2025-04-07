import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';

const ResultScreen = ({
  zodiacSign,
  mbtiType,
  typeDescription,
  scores,
  loading,
  onSendToDify,
  onReset
}) => {
  // MBTIのディメンションを計算
  const calculateDimension = (dim1, dim2) => {
    const total = scores[dim1] + scores[dim2];
    if (total === 0) return { dominant: dim1, percentage: 50 };

    const percentage = Math.round((scores[dim1] / total) * 100);
    return {
      dominant: scores[dim1] >= scores[dim2] ? dim1 : dim2,
      percentage: percentage
    };
  };

  const dimensions = [
    calculateDimension('E', 'I'),
    calculateDimension('S', 'N'),
    calculateDimension('T', 'F'),
    calculateDimension('J', 'P')
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <img
            src={process.env.PUBLIC_URL + "/toramaro-mbtiresult.png"}
            alt="トラまろMBTI診断結果"
            style={{
              width: '180px',
              height: '180px',
              objectFit: 'contain',
              marginBottom: '1rem',
              display: 'block'
            }}
          />
        </Box>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            あなたの性格タイプは: <strong>{mbtiType}</strong>
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            星座: {zodiacSign}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" paragraph>
            {typeDescription}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            {dimensions.map((dim, index) => {
              const labels = {
                0: { left: 'E（外向型）', right: 'I（内向型）' },
                1: { left: 'S（現実型）', right: 'N（直感型）' },
                2: { left: 'T（思考型）', right: 'F（感情型）' },
                3: { left: 'J（判断型）', right: 'P（知覚型）' },
              };

              const leftScore = index === 0 ? scores.E :
                              index === 1 ? scores.S :
                              index === 2 ? scores.T :
                              scores.J;

              const rightScore = index === 0 ? scores.I :
                               index === 1 ? scores.N :
                               index === 2 ? scores.F :
                               scores.P;

              return (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs={5} sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" color="text.primary">
                            {labels[index].left}
                            <Box component="span" sx={{ display: 'block', fontWeight: 'bold', mt: 1 }}>
                              {leftScore}点
                            </Box>
                          </Typography>
                        </Grid>
                        <Grid item xs={2} sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Box sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              bgcolor: dim.percentage >= 50 ? 'primary.main' : 'transparent',
                              border: '2px solid',
                              borderColor: 'primary.main'
                            }} />
                            <Box sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              bgcolor: dim.percentage < 50 ? 'secondary.main' : 'transparent',
                              border: '2px solid',
                              borderColor: 'secondary.main'
                            }} />
                          </Box>
                        </Grid>
                        <Grid item xs={5} sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" color="text.primary">
                            {labels[index].right}
                            <Box component="span" sx={{ display: 'block', fontWeight: 'bold', mt: 1 }}>
                              {rightScore}点
                            </Box>
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            トラまろに取説を作ってもらう
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            あなたのMBTIタイプと星座に基づいた、より詳細な洞察を得ることができます。
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={onSendToDify}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                分析中...
              </>
            ) : (
              '作成開始'
            )}
          </Button>

          <Button
            variant="outlined"
            onClick={onReset}
            disabled={loading}
          >
            もう一度診断する
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResultScreen;