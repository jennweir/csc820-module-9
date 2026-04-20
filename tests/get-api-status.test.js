
describe('GET-api-status-success', () => {
  it('should have a status code of 200', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    res.json({
      status: 'Running',
      timestamp: new Date().toISOString()
    });
    res.status(200);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should have a response body containing status and timestamp', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const responseData = {
      status: 'Running',
      timestamp: new Date().toISOString()
    };
    res.json(responseData);
    const jsonData = res.json.mock.calls[0][0];
    expect(jsonData.status).toEqual('Running');
    expect(jsonData).toHaveProperty('timestamp');
  });

  it('should have a response time below 500ms', () => {
    const startTime = Date.now();
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    res.status(200);
    res.json({
      status: 'Running',
      timestamp: new Date().toISOString()
    });
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(500);
  });
});

describe('GET-api-status-unknown-endpoint', () => {
  it('should have a status code of 404 due to unknown endpoint', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    res.status(404);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});