import React from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Avatar
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

const InitialScreen = ({ birthdate, setBirthdate, gender, setGender, onStartDiagnosis }) => {
  // 年月日の入力ハンドラ
  const handleBirthdateChange = (field, value) => {
    setBirthdate({
      ...birthdate,
      [field]: parseInt(value, 10) || 0
    });
  };

  // 性別選択ハンドラ
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  // 年の選択肢を生成
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const options = [];
    for (let i = currentYear - 80; i <= currentYear - 18; i++) {
      options.push(
        <option key={i} value={i}>
          {i}年
        </option>
      );
    }
    return options;
  };

  // 月の選択肢を生成
  const generateMonthOptions = () => {
    const options = [];
    for (let i = 1; i <= 12; i++) {
      options.push(
        <option key={i} value={i}>
          {i}月
        </option>
      );
    }
    return options;
  };

  // 日の選択肢を生成
  const generateDayOptions = () => {
    const options = [];
    // 簡略化のため常に31日まで表示
    for (let i = 1; i <= 31; i++) {
      options.push(
        <option key={i} value={i}>
          {i}日
        </option>
      );
    }
    return options;
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
          <PetsIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom>
          トラまろ　天命診断
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          あなたのMBTIと星座で未来を占います
        </Typography>

        {/* 生年月日セレクト */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            生年月日を選択してください
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="年"
                value={birthdate.year}
                onChange={(e) => handleBirthdateChange('year', e.target.value)}
                SelectProps={{ native: true }}
              >
                {generateYearOptions()}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="月"
                value={birthdate.month}
                onChange={(e) => handleBirthdateChange('month', e.target.value)}
                SelectProps={{ native: true }}
              >
                {generateMonthOptions()}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="日"
                value={birthdate.day}
                onChange={(e) => handleBirthdateChange('day', e.target.value)}
                SelectProps={{ native: true }}
              >
                {generateDayOptions()}
              </TextField>
            </Grid>
          </Grid>
        </Box>

        {/* 性別選択 */}
        <Box sx={{ mb: 4 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              <Typography variant="h6" component="h2" gutterBottom>
                性別を選択してください
              </Typography>
            </FormLabel>
            <RadioGroup
              row
              name="gender"
              value={gender}
              onChange={handleGenderChange}
              sx={{ justifyContent: 'center', mb: 2 }}
            >
              <FormControlLabel value="男性" control={<Radio />} label="男性" />
              <FormControlLabel value="女性" control={<Radio />} label="女性" />
              <FormControlLabel value="その他" control={<Radio />} label="その他" />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* 開始ボタン */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onStartDiagnosis}
          disabled={!gender}
          sx={{ px: 4, py: 1 }}
        >
          診断スタート
        </Button>
      </Box>
    </Container>
  );
};

export default InitialScreen;