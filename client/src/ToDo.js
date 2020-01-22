import React from 'react';
import { Card, CardContent, Typography } from "@material-ui/core"

export default function ToDo({ title }) {

    return (
        <Card >
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    {title}
                </Typography>

            </CardContent>
        </Card>
    );
}